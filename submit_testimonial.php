<?php
// Set error reporting in development environment
// Comment this out in production
// error_reporting(E_ALL);
// ini_set('display_errors', 1);

// Configuration
$admin_email = "info@arkantechsolutions.com"; // Change to your email
$upload_dir = "uploads/testimonials/";
$data_file = "data/testimonials.json";

// Create directories if they don't exist
if (!file_exists($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

if (!file_exists("data")) {
    mkdir("data", 0755, true);
}

// Initialize response
$response = [
    'success' => false,
    'message' => 'An error occurred while processing your submission.'
];

// Process form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect form data
    $clientName = filter_input(INPUT_POST, 'clientName', FILTER_SANITIZE_STRING);
    $clientEmail = filter_input(INPUT_POST, 'clientEmail', FILTER_SANITIZE_EMAIL);
    $companyName = filter_input(INPUT_POST, 'companyName', FILTER_SANITIZE_STRING);
    $industry = filter_input(INPUT_POST, 'industry', FILTER_SANITIZE_STRING);
    $location = filter_input(INPUT_POST, 'location', FILTER_SANITIZE_STRING);
    $storyText = filter_input(INPUT_POST, 'storyText', FILTER_SANITIZE_STRING);
    $metricsValue = filter_input(INPUT_POST, 'metricsValue', FILTER_SANITIZE_NUMBER_INT);
    $metricsDesc = filter_input(INPUT_POST, 'metricsDesc', FILTER_SANITIZE_STRING);
    $rating = filter_input(INPUT_POST, 'rating', FILTER_SANITIZE_NUMBER_INT);
    
    // Services used (array)
    $servicesUsed = [];
    if (isset($_POST['servicesUsed']) && is_array($_POST['servicesUsed'])) {
        foreach ($_POST['servicesUsed'] as $service) {
            $servicesUsed[] = filter_var($service, FILTER_SANITIZE_STRING);
        }
    }
    
    // Validate required fields
    if (empty($clientName) || empty($clientEmail) || empty($companyName) || 
        empty($industry) || empty($location) || empty($storyText) || empty($rating)) {
        $response['message'] = 'Please fill in all required fields.';
        echo json_encode($response);
        exit;
    }
    
    // Validate email
    if (!filter_var($clientEmail, FILTER_VALIDATE_EMAIL)) {
        $response['message'] = 'Please enter a valid email address.';
        echo json_encode($response);
        exit;
    }
    
    // Process file upload
    $photoFilename = '';
    if (isset($_FILES['clientPhoto']) && $_FILES['clientPhoto']['error'] == 0) {
        $allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
        $file_info = finfo_open(FILEINFO_MIME_TYPE);
        $mime_type = finfo_file($file_info, $_FILES['clientPhoto']['tmp_name']);
        finfo_close($file_info);
        
        if (!in_array($mime_type, $allowed_types)) {
            $response['message'] = 'Invalid file type. Please upload a JPEG, PNG, or GIF image.';
            echo json_encode($response);
            exit;
        }
        
        // Generate unique filename
        $timestamp = time();
        $safe_name = preg_replace('/[^a-zA-Z0-9]/', '_', $clientName);
        $extension = pathinfo($_FILES['clientPhoto']['name'], PATHINFO_EXTENSION);
        $photoFilename = $safe_name . '_' . $timestamp . '.' . $extension;
        
        // Move uploaded file
        if (!move_uploaded_file($_FILES['clientPhoto']['tmp_name'], $upload_dir . $photoFilename)) {
            $response['message'] = 'Failed to upload image. Please try again.';
            echo json_encode($response);
            exit;
        }
    }
    
    // Prepare testimonial data
    $testimonial = [
        'id' => uniqid(),
        'timestamp' => time(),
        'status' => 'pending', // pending, approved, rejected
        'clientName' => $clientName,
        'clientEmail' => $clientEmail,
        'companyName' => $companyName,
        'industry' => $industry,
        'location' => $location,
        'storyText' => $storyText,
        'servicesUsed' => $servicesUsed,
        'metricsValue' => $metricsValue,
        'metricsDesc' => $metricsDesc,
        'rating' => $rating,
        'photoFilename' => $photoFilename
    ];
    
    // Load existing testimonials
    $testimonials = [];
    if (file_exists($data_file)) {
        $json_data = file_get_contents($data_file);
        if (!empty($json_data)) {
            $testimonials = json_decode($json_data, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                $testimonials = [];
            }
        }
    }
    
    // Add new testimonial
    $testimonials[] = $testimonial;
    
    // Save to file
    if (file_put_contents($data_file, json_encode($testimonials, JSON_PRETTY_PRINT))) {
        // Send notification email
        $subject = "New Testimonial Submission - {$clientName}";
        $message = "A new testimonial has been submitted:\n\n";
        $message .= "Name: {$clientName}\n";
        $message .= "Company: {$companyName}\n";
        $message .= "Industry: {$industry}\n";
        $message .= "Location: {$location}\n";
        $message .= "Rating: {$rating} stars\n\n";
        $message .= "Testimonial:\n{$storyText}\n\n";
        $message .= "Services Used: " . implode(", ", $servicesUsed) . "\n";
        if (!empty($metricsValue) && !empty($metricsDesc)) {
            $message .= "Metrics: {$metricsValue}% {$metricsDesc}\n";
        }
        $message .= "\nPlease log in to review and approve this testimonial.";
        
        $headers = "From: no-reply@arkantechsolutions.com\r\n";
        $headers .= "Reply-To: {$clientEmail}\r\n";
        
        if (mail($admin_email, $subject, $message, $headers)) {
            $response['success'] = true;
            $response['message'] = 'Thank you for sharing your success story! We will review it shortly.';
        } else {
            $response['message'] = 'Testimonial saved but email notification failed.';
        }
    } else {
        $response['message'] = 'Failed to save testimonial data.';
    }
}

// Return response as JSON
header('Content-Type: application/json');
echo json_encode($response); 