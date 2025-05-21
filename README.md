# Lorcana Match Tracker

Lorcana Match Tracker is a web application designed to help players of the Disney Lorcana Trading Card Game record their tournament matches, track their performance, and view statistics about their games, decks, and opponents.

## Features

*   **Tournament Tracking:** Easily create and manage your Lorcana tournament entries.
*   **Detailed Match Logging:** Record comprehensive details for each match, including:
    *   Your deck and its colors
    *   Opponent's deck and colors (if known)
    *   Game format (e.g., Best of 1, Best of 3)
    *   Match result (Win, Loss, Draw)
    *   Notes about the match
*   **Performance Statistics:** Gain insights into your gameplay with statistics such as:
    *   Overall win/loss/draw ratios
    *   Performance with different ink colors
    *   Tournament-specific statistics
*   **Data Visualization:** View your statistics through charts and graphs.
*   **Theme Customization:** Switch between light and dark modes for comfortable viewing.
*   **Persistent Storage:** Tournament and match data are saved in your browser's local storage.

## Tech Stack

This project is built with the following technologies:

*   **Frontend:**
    *   [React](https://react.dev/) - A JavaScript library for building user interfaces.
    *   [TypeScript](https://www.typescriptlang.org/) - A typed superset of JavaScript that compiles to plain JavaScript.
    *   [Vite](https://vitejs.dev/) - A modern frontend build tool that provides an extremely fast development environment.
    *   [React Router](https://reactrouter.com/) - For client-side routing.
    *   [TanStack Query](https://tanstack.com/query/latest) - For data fetching, caching, and server state management.
*   **UI & Styling:**
    *   [Shadcn UI](https://ui.shadcn.com/) - A collection of re-usable UI components.
    *   [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for rapid UI development.
    *   [Recharts](https://recharts.org/) - A composable charting library.
*   **Linting:**
    *   [ESLint](https://eslint.org/) - For identifying and reporting on patterns in JavaScript/TypeScript.

## Getting Started

To get a local copy up and running, follow these simple steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repository-name.git
    cd your-repository-name
    ```
    *(Replace `your-username/your-repository-name` with the actual path to this repository if you are hosting it on GitHub or a similar platform. If it's a local-only project for now, you might want to adjust this part or add a note.)*

2.  **Install NPM packages:**
    Make sure you have Node.js and npm installed. Then, run the following command in the project root:
    ```bash
    npm install
    ```

3.  **Run the development server:**
    Once the dependencies are installed, you can start the development server:
    ```bash
    npm run dev
    ```
    This will usually open the application in your default web browser at `http://localhost:5173` (Vite's default port). Check your terminal for the exact address.

## Available Scripts

In the project directory, you can run the following scripts:

*   `npm run dev`
    *   Runs the app in development mode using Vite.
    *   Open [http://localhost:5173](http://localhost:5173) (or the address shown in your terminal) to view it in the browser.
    *   The page will reload if you make edits.

*   `npm run build`
    *   Builds the app for production to the `dist` folder.
    *   It correctly bundles React in production mode and optimizes the build for the best performance.

*   `npm run build:dev`
    *   Builds the app using Vite's development mode. This is typically used for debugging build issues and is not a standard production build.

*   `npm run lint`
    *   Runs ESLint to analyze the code for potential errors and style issues.

*   `npm run preview`
    *   Serves the production build from the `dist` folder locally. This is useful for checking the final build before deployment.

## Future Enhancements (Ideas)

Here are some ideas for potential future enhancements:

*   **User Accounts:** Allow multiple users to register and manage their own tournament data.
*   **Cloud Sync:** Synchronize data across multiple devices.
*   **Advanced Statistics:** Implement more detailed statistical breakdowns (e.g., matchup specific win rates, performance over time).
*   **Import/Export Data:** Allow users to import or export their tournament data in common formats (e.g., CSV, JSON).
*   **Card Database Integration:** Link card names or decklists to an external Lorcana card database.
*   **Decklist Management:** A dedicated section to create, save, and manage decklists.
