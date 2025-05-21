# Authentication and Verification Flows

This directory contains the authentication and verification screens for Leazzy mobile app.

## Email Verification Flow

1. User creates an account with email/password or updates email
2. Email verification link is sent to the provided email
3. User is taken to the `email-verification.tsx` screen which:
   - Shows instructions to check their email
   - Provides a resend button if the email doesn't arrive
   - Handles verification links when clicked from email
   - Updates the user's email verified status in Firebase

## Phone Verification Flow

1. User enters phone number during signup or updates phone number
2. SMS with OTP code is sent to the provided phone number
3. User is taken to the `phone-verification.tsx` screen which:
   - Uses OTP input component for code entry
   - Provides resend functionality 
   - Handles phone verification using Firebase Phone Authentication
   - Updates the user's phone verified status once confirmed

## Email OTP Verification Flow (Alternative)

As an alternative to email links, we also provide email OTP verification:
1. User receives a 6-digit code via email
2. User enters the code in the `email-otp-verification.tsx` screen
3. System verifies the code and updates verification status

## Files Structure

- `set-password.tsx` - Create account and set password
- `email-verification.tsx` - Verify email using email links
- `email-otp-verification.tsx` - Verify email using OTP codes
- `phone-verification.tsx` - Verify phone numbers using SMS OTP
- `login.tsx` - Main login screen with various authentication options

## Components

The verification screens use a reusable OTP input component:
- `components/OTPInput.tsx` - Enhanced OTP input field with animations
