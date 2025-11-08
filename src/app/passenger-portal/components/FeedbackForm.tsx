'use client';

import Icon from '@/components/ui/AppIcon';
import React, { useState } from 'react';

interface FeedbackFormProps {
  onSubmit: (feedback: {
    type: string;
    routeNumber: string;
    message: string;
    contactEmail?: string;
    rating: number;
  }) => void;
}

const FeedbackForm = ({ onSubmit }: FeedbackFormProps) => {
  const [formData, setFormData] = useState({
    type: 'suggestion',
    routeNumber: '',
    message: '',
    contactEmail: '',
    rating: 5
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const feedbackTypes = [
    { value: 'complaint', label: 'Complaint', icon: 'ExclamationTriangleIcon', color: 'text-error' },
    { value: 'suggestion', label: 'Suggestion', icon: 'LightBulbIcon', color: 'text-warning' },
    { value: 'compliment', label: 'Compliment', icon: 'HeartIcon', color: 'text-success' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    onSubmit(formData);
    setIsSubmitted(true);
    setIsSubmitting(false);

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        type: 'suggestion',
        routeNumber: '',
        message: '',
        contactEmail: '',
        rating: 5
      });
    }, 3000);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isSubmitted) {
    return (
      <div className="card p-8 text-center">
        <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="CheckIcon" size={32} className="text-success-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Thank You!</h3>
        <p className="text-text-secondary">Your feedback has been submitted successfully. We appreciate your input to improve our services.</p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Icon name="ChatBubbleLeftRightIcon" size={24} className="text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Share Your Feedback</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Feedback Type */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">Feedback Type</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {feedbackTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => handleInputChange('type', type.value)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  formData.type === type.value
                    ? 'border-primary bg-primary/10' :'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <Icon name={type.icon as any} size={24} className={type.color} />
                  <span className="text-sm font-medium text-foreground">{type.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Route Number */}
        <div>
          <label htmlFor="routeNumber" className="block text-sm font-medium text-foreground mb-2">
            Route Number (Optional)
          </label>
          <input
            type="text"
            id="routeNumber"
            value={formData.routeNumber}
            onChange={(e) => handleInputChange('routeNumber', e.target.value)}
            placeholder="e.g., Route 1, ET-001"
            className="input w-full"
          />
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Overall Rating
          </label>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleInputChange('rating', star)}
                className="p-1 hover:scale-110 transition-transform duration-200"
              >
                <Icon
                  name="StarIcon"
                  size={24}
                  variant={star <= formData.rating ? 'solid' : 'outline'}
                  className={star <= formData.rating ? 'text-warning' : 'text-muted-foreground'}
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-text-secondary">
              {formData.rating}/5 stars
            </span>
          </div>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
            Your Message *
          </label>
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            placeholder="Please share your feedback, suggestions, or concerns..."
            rows={4}
            required
            className="input w-full resize-none"
          />
        </div>

        {/* Contact Email */}
        <div>
          <label htmlFor="contactEmail" className="block text-sm font-medium text-foreground mb-2">
            Contact Email (Optional)
          </label>
          <input
            type="email"
            id="contactEmail"
            value={formData.contactEmail}
            onChange={(e) => handleInputChange('contactEmail', e.target.value)}
            placeholder="your.email@example.com"
            className="input w-full"
          />
          <p className="text-xs text-text-secondary mt-1">
            Provide your email if you'd like us to follow up on your feedback
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !formData.message.trim()}
          className="w-full btn-primary py-3 px-6 text-base font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2"></div>
              Submitting...
            </>
          ) : (
            <>
              <Icon name="PaperAirplaneIcon" size={20} className="mr-2" />
              Submit Feedback
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;