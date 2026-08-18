# Khayr (خير)

Khayr is a React Native mobile application for redistributing surplus food to local charities and managing volunteer deliveries. It integrates Google Cloud Vision API to automatically identify food items from photos, flag urgent items nearing expiration, and coordinate pickups between donors, charities, and drivers using real-time geolocation.

## Table of Contents
- [Features](#features)
- [User Roles](#user-roles)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Impact Calculation](#impact-calculation)

## Features

- **Automated Food Recognition**: Uses Google Cloud Vision API to classify uploaded food photos and auto-fill donation descriptions.
- **Urgency Detection (SOS)**: Analyzes classification labels for keywords related to perishable or overripe food, automatically marking donations as urgent for fast pickup.
- **Geolocation & Mapping**: Shows available donations and pickup routes on an interactive map for charities and volunteers.
- **Real-Time Synchronization**: Synchronizes donation lifecycle states across donors, charities, and volunteer drivers using Firebase Firestore.
- **Impact Tracking**: Calculates estimated meals provided and CO2 reduction based on donated food weight.
- **Multi-language Support**: Supports Arabic and English with right-to-left (RTL) layout handling.

## User Roles

- **Donor**: Uploads food photos, sets pickup details, toggles SOS urgency status, and views personal donation history.
- **Charity**: Browses available donations nearby, claims donations, requests volunteer drivers, and manages organization profile details.
- **Volunteer**: Views available pickup and delivery tasks on a map, accepts delivery assignments, and confirms completed drop-offs.
- **Admin**: Verifies charity and donor accounts, monitors system activity, and exports usage reports in CSV/PDF format.

## System Architecture

The application uses React Native for the client interface, Zustand for global state management, and Firebase for authentication, database storage, and push notifications.

- **Frontend**: React Native with TypeScript and Zustand.
- **Services**: Google Cloud Vision API for image classification, React Native Maps for location services.
- **Backend**: Firebase Authentication, Cloud Firestore (database), Cloud Storage (images), Cloud Messaging (notifications), Cloud Functions (background triggers).

## Tech Stack

- React Native 0.83.4 (Bare CLI)
- TypeScript 5.8.3
- Zustand (State Management)
- Firebase (Auth, Firestore, Storage, Messaging, Functions)
- Google Cloud Vision API
- React Native Maps
- i18next & react-i18next

## Project Structure

```
KhayrApp/
├── android/                 # Android native project files
├── ios/                     # iOS native project files
├── functions/               # Firebase Cloud Functions
├── src/
│   ├── assets/              # Logos and icons
│   ├── config/              # Firebase, i18n, and app theme settings
│   ├── controllers/         # Zustand state stores
│   ├── models/              # TypeScript interface definitions
│   ├── navigation/          # React Navigation stacks and tabs
│   ├── services/            # Vision API, location, and impact calculations
│   └── views/               # React Native UI components and screens
├── .env.example             # Environment variable template
├── .gitignore               # Git ignore rules
├── App.tsx                  # Root application component
└── index.js                 # App entry point
```

---

## Impact Calculation

System impact metrics are derived from the weight of confirmed food deliveries:

- **Meals Provided**: Quantity (kg) * 2
- **CO2 Prevented**: Quantity (kg) * 2.5

Metrics update automatically in Firestore when a volunteer confirms a delivery.


