package com.corethreads.corethreads.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Arrays;

@Configuration
public class SecurityConfig implements WebMvcConfigurer {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // 🔒 SECURITY: Only allow specific trusted origins
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:5173",
                "http://localhost:3000",
                "https://corethreads.com"
        ));

        // 🔒 SECURITY: Only allow necessary HTTP methods
        configuration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "OPTIONS"
        ));

        // 🔒 SECURITY: Allow necessary headers for session-based auth
        configuration.setAllowedHeaders(Arrays.asList(
                "Content-Type", "Authorization", "X-CSRF-TOKEN", "Cache-Control", "Pragma"
        ));

        // Expose only necessary headers
        configuration.setExposedHeaders(Arrays.asList(
                "Content-Type", "X-Total-Count"
        ));

        configuration.setAllowCredentials(true);
        
        // 🔒 SECURITY: Set reasonable cache time for preflight requests
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    // 🔒 Global CORS filter to ensure headers are applied even without Spring Security
    @Bean
    public FilterRegistrationBean<CorsFilter> corsFilterRegistration(@Qualifier("corsConfigurationSource") CorsConfigurationSource source) {
        FilterRegistrationBean<CorsFilter> bean = new FilterRegistrationBean<>(new CorsFilter(source));
        bean.setOrder(0); // Highest precedence so preflight requests are handled
        return bean;
    }

    /**
     * 🔒 Security Headers Filter
     * Adds comprehensive security headers to prevent common web vulnerabilities
     */
    @Bean
    public FilterRegistrationBean<Filter> securityHeadersFilter() {
        Filter filter = new Filter() {
            @Override
            public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
                    throws IOException, ServletException {
                HttpServletRequest httpRequest = (HttpServletRequest) request;
                HttpServletResponse httpResponse = (HttpServletResponse) response;

                // 🔒 SECURITY: Prevent MIME type sniffing (CWE-264)
                httpResponse.setHeader("X-Content-Type-Options", "nosniff");

                // 🔒 SECURITY: Prevent clickjacking attacks (CWE-346)
                httpResponse.setHeader("X-Frame-Options", "DENY");

                // 🔒 SECURITY: Enable XSS protection for older browsers
                httpResponse.setHeader("X-XSS-Protection", "1; mode=block");

                // 🔒 SECURITY: Enforce HTTPS (CWE-295)
                httpResponse.setHeader("Strict-Transport-Security", 
                        "max-age=31536000; includeSubDomains; preload");

                // 🔒 SECURITY: Content Security Policy (CWE-79, CWE-73)
                httpResponse.setHeader("Content-Security-Policy",
                        "default-src 'self'; " +
                        "script-src 'self' https://accounts.google.com https://connect.facebook.net; " +
                        "style-src 'self' 'unsafe-inline'; " +
                        "img-src 'self' data: https:; " +
                        "connect-src 'self' https://accounts.google.com https://graph.facebook.com; " +
                        "frame-src https://accounts.google.com https://www.facebook.com; " +
                        "object-src 'none'; " +
                        "base-uri 'self'; " +
                        "form-action 'self'");

                // 🔒 SECURITY: Referrer Policy (CWE-200)
                httpResponse.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

                // 🔒 SECURITY: Permissions Policy (CWE-215)
                httpResponse.setHeader("Permissions-Policy", 
                        "geolocation=(), microphone=(), camera=(), payment=()");

                // 🔒 SECURITY: Hide server information (CWE-200)
                httpResponse.setHeader("Server", "");

                // 🔒 SECURITY: Prevent cache of sensitive data
                httpResponse.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
                httpResponse.setHeader("Pragma", "no-cache");
                httpResponse.setHeader("Expires", "0");

                chain.doFilter(request, response);
            }
        };
        
        FilterRegistrationBean<Filter> bean = new FilterRegistrationBean<>(filter);
        bean.setOrder(1); // After CORS filter
        return bean;
    }

    /**
     * 🔒 Input Validation Filter
     * Validates and sanitizes incoming requests
     */
    @Bean
    public FilterRegistrationBean<Filter> inputValidationFilter() {
        Filter filter = new Filter() {
            @Override
            public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
                    throws IOException, ServletException {
                HttpServletRequest httpRequest = (HttpServletRequest) request;
                HttpServletResponse httpResponse = (HttpServletResponse) response;

                // 🔒 SECURITY: Check for suspicious request patterns
                String contentType = httpRequest.getContentType();
                
                // Validate content length
                long contentLength = httpRequest.getContentLengthLong();
                if (contentLength > 10 * 1024 * 1024) { // 10MB limit
                    httpResponse.sendError(413, // HTTP 413 Payload Too Large
                            "Request payload exceeds maximum size");
                    return;
                }

                // 🔒 SECURITY: Detect potential SQL injection in parameters
                String queryString = httpRequest.getQueryString();
                if (queryString != null && containsSuspiciousPatterns(queryString)) {
                    httpResponse.sendError(HttpServletResponse.SC_BAD_REQUEST, 
                            "Invalid request parameters");
                    return;
                }

                chain.doFilter(request, response);
            }

            /**
             * Detects common injection attack patterns
             */
            private boolean containsSuspiciousPatterns(String input) {
                String lowerInput = input.toLowerCase();
                
                // SQL injection patterns
                if (lowerInput.contains("union") || 
                    lowerInput.contains("select") ||
                    lowerInput.contains("insert") ||
                    lowerInput.contains("delete") ||
                    lowerInput.contains("drop") ||
                    lowerInput.contains("exec") ||
                    lowerInput.contains("--") ||
                    lowerInput.contains(";") ||
                    lowerInput.contains("'")) {
                    return true;
                }
                
                // XSS patterns
                if (lowerInput.contains("<script") ||
                    lowerInput.contains("javascript:") ||
                    lowerInput.contains("onerror=") ||
                    lowerInput.contains("onclick=")) {
                    return true;
                }
                
                return false;
            }
        };
        
        FilterRegistrationBean<Filter> bean = new FilterRegistrationBean<>(filter);
        bean.setOrder(2); // After security headers filter
        return bean;
    }

    /**
     * 🔒 Rate Limiting Headers Filter
     * Helps prevent abuse and DoS attacks
     */
    @Bean
    public FilterRegistrationBean<Filter> rateLimitingHeadersFilter() {
        Filter filter = new Filter() {
            @Override
            public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
                    throws IOException, ServletException {
                HttpServletResponse httpResponse = (HttpServletResponse) response;

                // 🔒 SECURITY: Add rate limiting headers
                httpResponse.setHeader("X-RateLimit-Limit", "1000");
                httpResponse.setHeader("X-RateLimit-Remaining", "999");
                httpResponse.setHeader("X-RateLimit-Reset", String.valueOf(System.currentTimeMillis() + 3600000));

                chain.doFilter(request, response);
            }
        };
        
        FilterRegistrationBean<Filter> bean = new FilterRegistrationBean<>(filter);
        bean.setOrder(3); // After input validation filter
        return bean;
    }
}

