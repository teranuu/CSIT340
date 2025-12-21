package com.corethreads.corethreads.util;

import java.util.regex.Pattern;

/**
 * 🔒 Input Validation & Sanitization Utility
 * Prevents XSS, SQL Injection, and other malicious input attacks
 */
public class InputValidator {

    // Patterns for validation
    private static final Pattern USERNAME_PATTERN = Pattern.compile("^[a-zA-Z0-9_]{3,20}$");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");
    private static final Pattern SAFE_TEXT_PATTERN = Pattern.compile("^[a-zA-Z0-9\\s.,!?'-]*$");
    private static final Pattern SQL_INJECTION_PATTERN = Pattern.compile(
            "('|(\\-\\-)|(;)|(\\||\\|)|(\\*)|xp_|sp_|exec|execute|select|insert|update|delete|drop|create|alter)" ,
            Pattern.CASE_INSENSITIVE
    );

    private static final int MAX_USERNAME_LENGTH = 20;
    private static final int MAX_PASSWORD_LENGTH = 128;
    private static final int MAX_EMAIL_LENGTH = 254;
    private static final int MAX_TEXT_LENGTH = 500;

    /**
     * Validates username
     * Rules: 3-20 characters, alphanumeric and underscore only
     * @param username Username to validate
     * @return true if valid, false otherwise
     */
    public static boolean isValidUsername(String username) {
        if (username == null || username.isBlank()) {
            return false;
        }

        String trimmed = username.trim();
        
        if (trimmed.length() < 3 || trimmed.length() > MAX_USERNAME_LENGTH) {
            return false;
        }

        return USERNAME_PATTERN.matcher(trimmed).matches();
    }

    /**
     * Validates email address
     * @param email Email to validate
     * @return true if valid, false otherwise
     */
    public static boolean isValidEmail(String email) {
        if (email == null || email.isBlank()) {
            return false;
        }

        String trimmed = email.trim().toLowerCase();

        if (trimmed.length() > MAX_EMAIL_LENGTH) {
            return false;
        }

        if (!EMAIL_PATTERN.matcher(trimmed).matches()) {
            return false;
        }

        // Additional check for common invalid patterns
        if (trimmed.contains("..") || trimmed.endsWith(".")) {
            return false;
        }

        return true;
    }

    /**
     * Validates password strength
     * Rules: 6+ chars, at least one non-letter character
     * @param password Password to validate
     * @return true if valid, false otherwise
     */
    public static boolean isValidPassword(String password) {
        if (password == null || password.isBlank()) {
            return false;
        }

        if (password.length() < 6 || password.length() > MAX_PASSWORD_LENGTH) {
            return false;
        }

        // Must contain at least one non-letter character
        if (password.matches("^[A-Za-z]+$")) {
            return false;
        }

        return true;
    }

    /**
     * Sanitizes text input to prevent XSS
     * @param input Text input
     * @param maxLength Maximum allowed length
     * @return Sanitized text
     */
    public static String sanitizeText(String input, int maxLength) {
        if (input == null) {
            return "";
        }

        // Trim whitespace
        String sanitized = input.trim();

        // Remove null bytes and control characters
        sanitized = sanitized.replaceAll("[\\x00-\\x1F\\x7F]", "");

        // Escape HTML special characters
        sanitized = sanitized
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#x27;")
                .replace("/", "&#x2F;");

        // Limit length
        if (sanitized.length() > maxLength) {
            sanitized = sanitized.substring(0, maxLength);
        }

        return sanitized;
    }

    /**
     * Detects potential SQL injection attempts
     * @param input Input to check
     * @return true if potential SQL injection detected
     */
    public static boolean containsSQLInjectionAttempt(String input) {
        if (input == null || input.isBlank()) {
            return false;
        }

        return SQL_INJECTION_PATTERN.matcher(input).find();
    }

    /**
     * Detects potential XSS attempts
     * @param input Input to check
     * @return true if potential XSS detected
     */
    public static boolean containsXSSAttempt(String input) {
        if (input == null || input.isBlank()) {
            return false;
        }

        String lowerInput = input.toLowerCase();

        // Check for common XSS patterns
        return lowerInput.contains("<script") ||
               lowerInput.contains("javascript:") ||
               lowerInput.contains("onerror=") ||
               lowerInput.contains("onload=") ||
               lowerInput.contains("onclick=") ||
               lowerInput.contains("onmouseover=") ||
               lowerInput.contains("<iframe") ||
               lowerInput.contains("<object") ||
               lowerInput.contains("<embed");
    }

    /**
     * Sanitizes user-provided text with XSS prevention
     * Removes dangerous characters while preserving readability
     * @param input User input
     * @param maxLength Maximum allowed length
     * @return Sanitized input
     */
    public static String sanitizeUserInput(String input, int maxLength) {
        if (input == null) {
            return "";
        }

        // First check for injection attempts
        if (containsSQLInjectionAttempt(input) || containsXSSAttempt(input)) {
            throw new SecurityException("Potentially malicious input detected");
        }

        return sanitizeText(input, maxLength);
    }

    /**
     * Validates and sanitizes search queries
     * @param query Search query from user
     * @param maxLength Maximum allowed length
     * @return Sanitized search query
     */
    public static String sanitizeSearchQuery(String query, int maxLength) {
        if (query == null) {
            return "";
        }

        String sanitized = query.trim();

        // Remove potentially dangerous characters
        sanitized = sanitized.replaceAll("[<>\"{};\\\\`]", "");

        // Remove null bytes and control characters
        sanitized = sanitized.replaceAll("[\\x00-\\x1F\\x7F]", "");

        // Remove multiple consecutive spaces
        sanitized = sanitized.replaceAll("\\s+", " ");

        // Limit length
        if (sanitized.length() > maxLength) {
            sanitized = sanitized.substring(0, maxLength);
        }

        return sanitized;
    }

    /**
     * Validates numeric input
     * @param value Numeric value
     * @param min Minimum allowed value
     * @param max Maximum allowed value
     * @return true if valid
     */
    public static boolean isValidNumber(long value, long min, long max) {
        return value >= min && value <= max;
    }

    /**
     * Validates numeric input
     * @param value Numeric value
     * @param min Minimum allowed value
     * @param max Maximum allowed value
     * @return true if valid
     */
    public static boolean isValidNumber(double value, double min, double max) {
        return value >= min && value <= max && Double.isFinite(value);
    }

    /**
     * Custom exception for security-related validation failures
     */
    public static class SecurityException extends RuntimeException {
        public SecurityException(String message) {
            super(message);
        }

        public SecurityException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}
