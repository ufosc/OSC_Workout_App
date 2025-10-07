# OSC Workout

If you like exercising but don’t want to pay the $3 a month that top-tier workout apps charge then this is the project for you. The plan is to design a free OPEN SOURCE mobile app that you can download from a browser (PWA) and run locally on your phone (NO backend for this project). The goal is to implement as many high-quality workout app features as we can. Ideally we will be able to grab data from your other workout apps, allowing you to import your workout history into the OSC app.


## Quick Start
Trying to just get the project running on your local machine? You are in the right spot!

```sh
git clone https://github.com/ufosc/OSC_Workout_App.git
cd OSC_Workout_App
npm install
npm start
```

Looking to set things up for making contributions, review the Prequisites section to ensure you have all necessary items installed, then continue down to the Start Guide for full details.

## Prerquisites
### NPM
NPM is a widely used package manager for JavaScript and will ensure that all needed packages are installed and ready to go prior to running the project. We will be using it to manage the front-end dependencies for this projects, to install: 
1. Visit the [installer page](https://nodejs.org/en/download).
2. Choose the installer version for your operating system.
### Git
Git is an open-source version control software supporting online repositories like GitHub, BitBucket, GitLab, and others. To install:

1. Visit the Git [download page](https://git-scm.com/downloads).
2. Choose the "standalone installer" for your operating system.

Hint: If you are on windows, we recommend you use the GitBash CLI that comes with the install. Otherwise, if you are on a Unix based system (Linux, MacOS), then use the normal terminal.

## Start Guide
Now all prerequisites have been installed, you are ready to run the OSC Workout Application!

### 1. Fork Repo
Go to the top of this page and select the gray `Fork` button at the top right of the repository page. This will create a copy of the current repository that is owned under your GitHub profile, you will be able to submit pull requests (PR) from this repository to the parent repository (OSC_Workout_App).

### 2. Clone To Local Machine
From the file location on your local machine where you want to store the project, run the following command:
```sh
   git clone <git url>
```
The git URL will be the URL found on your forked repository home page in Github by clicking the green `Code` button then HTTPS (should be default selected) at the top of your forked repository page.

### 3. Install Dependencies 
This will install all the needed NPM packages to be able to run the project.

Note: This only needs to be run the first time the project is launched and any time the repository package.json file is updated.

```sh
   cd OSC_Workout_App
   npm install
```
### 4. Launch the App
To launch, simply run the following command:
```sh
   npm start
```
