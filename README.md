# Armortel Biller

A full-stack WiFi billing and customer management platform developed for Armortel Solutions. The system provides customer management, subscription tracking, billing operations, role-based administration, and remote access capabilities through Ngrok and Cloudflare Tunnel integration.

## Features

### Customer Management

* Customer registration and profile management
* Service package assignment
* Account status management
* Customer activity tracking

### Billing Management

* Subscription management
* Payment tracking
* Billing records management
* Customer account monitoring

### Authentication & Security

* JWT-based authentication
* Role-based access control
* Protected API endpoints
* Secure session management

### User Roles

#### Admin

* Full system administration
* User management
* Package management
* Billing oversight
* System configuration

#### Vendor

* Customer management
* Service provisioning
* Payment management
* Customer support operations

#### User

* Account access
* Subscription information
* Billing information
* Service status monitoring

## Technology Stack

### Frontend

* Vue 3
* TypeScript
* Vite
* Bootstrap
* Font Awesome

### Backend

* Node.js
* Express
* TypeScript
* MongoDB
* Mongoose

### Authentication

* JSON Web Tokens (JWT)

### Remote Access

* Ngrok
* Cloudflare Tunnel

## Project Structure

```text
frontend/       Vue application
backend/        Express API and business logic
Media/          Application assets and references
scripts/        Startup, shutdown, and maintenance utilities
.reroute/       Tunnel and routing configuration
```

## Installation

Clone the repository:

```bash
git clone https://github.com/<your-username>/armortel-biller.git
cd armortel-biller
```

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

## Running the Application

### Start Backend

```bash
cd backend
npm run dev
```

### Start Frontend

```bash
cd frontend
npm run dev
```

## Utility Scripts

The project includes Windows Batch and PowerShell utilities for managing development and deployment workflows.

### Start Main Project

Batch:

```text
scripts\Start-Project.bat
```

PowerShell:

```powershell
scripts\start-project.ps1
```

### Stop Main Project

Batch:

```text
scripts\Stop-Project.bat
```

PowerShell:

```powershell
scripts\stop-project.ps1
```

### Start Tunnel Services

Batch:

```text
scripts\Start-Reroute.bat
```

PowerShell:

```powershell
scripts\start-reroute.ps1
```

### Stop Tunnel Services

Batch:

```text
scripts\Stop-Reroute.bat
```

PowerShell:

```powershell
scripts\stop-reroute.ps1
```

### Administrative Control Utility

Launch the project control interface:

```text
scripts\Armortel-Control.bat
```

The control utility provides centralized management of project services, startup operations, shutdown operations, and tunnel management.

## Remote Access & Tunneling

The project supports exposing locally hosted services through secure tunnels using:

* Ngrok
* Cloudflare Tunnel

This functionality is useful for:

* Remote testing
* Client demonstrations
* External API integrations
* Preview environments
* Development collaboration

Tunnel configuration and routing settings are stored in the `.reroute` directory.

## Development Requirements

* Node.js
* npm
* MongoDB
* Windows PowerShell (for PowerShell utilities)

## Screenshots

Add screenshots of:

* Login page
* Dashboard
* Customer management
* Billing management
* Package management
* Administrative panels

## Highlights

* Full-stack web application
* RESTful API architecture
* MongoDB database integration
* JWT authentication
* Role-based access control
* Billing workflow management
* Customer lifecycle management
* Automated startup and deployment utilities
* Ngrok and Cloudflare Tunnel integration
* TypeScript across frontend and backend

## Disclaimer

This repository contains the application source code only. Production credentials, customer data, infrastructure details, environment configurations, and other sensitive information have been excluded.
