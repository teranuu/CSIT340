package com.corethreads.corethreads.service;

import com.corethreads.corethreads.entity.Review;
import com.corethreads.corethreads.repository.ReviewRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    public Review createReview(Review review) {
        review.setCreatedAt(LocalDateTime.now());
        return reviewRepository.save(review);
    }

    public Optional<Review> getReviewById(Long reviewId) {
        return reviewRepository.findById(reviewId);
    }

    public List<Review> getProductReviews(Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
    }

    public List<Review> getCustomerReviews(Long customerId) {
        return reviewRepository.findByCustomerId(customerId);
    }

    public Review updateReview(Long reviewId, Review reviewData) {
        return reviewRepository.findById(reviewId)
                .map(review -> {
                    review.setRating(reviewData.getRating());
                    review.setTitle(reviewData.getTitle());
                    review.setComment(reviewData.getComment());
                    return reviewRepository.save(review);
                })
                .orElseThrow(() -> new RuntimeException("Review not found"));
    }

    public void deleteReview(Long reviewId) {
        reviewRepository.deleteById(reviewId);
    }

    public void markHelpful(Long reviewId) {
        reviewRepository.findById(reviewId)
                .ifPresent(review -> {
                    review.setHelpfulCount(review.getHelpfulCount() + 1);
                    reviewRepository.save(review);
                });
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }
}
