## Phonebook Project

by Rafi Raihansyah Munandar
email: rafiraihansyahm@gmail.com
Deployed app link: https://phonebook-project-liard.vercel.app/

## Overview

A phonebook project which implements a _mobile first_ approach in design and development. thus, for best experience, open it in **mobile-view mode**
This project uses Next js version 13 for it's main frontend framework template. Tech stacks implemented in this project includes:

1. Apollo Client (GraphQL)
2. Emotion (CSS in js)
3. Jest & React testing library
4. react-toastify, react-icons, and react-loading-skeleton

## Key features, rationalizations, and assumptions

1. All data is **fetched and updated through the graphql** endpoint provided on the test. It is loaded using .env to ensure best practices
2. Favorite contact data is stored through **Web Storage API**, mainly using local storage, so it persists on page reload
3. Pagination are **implemented locally** due to the use case of having the need to **show 10 regular contacts** after the favorite contact session, and not have the favorite contacts exist in the regular contacts (no duplicates)
4. The search functionality implements **debounce** to make sure it won't overload the API with too frequent request due to updates in typing. The debounce time is set to 0.5 second
5. The contact detail page provide direct option whether user wants to edit right away or just leave the data as it is

## Developer notes

On the contact form page, whenever we want to add or edit more than 1 number, it usually reshuffles the order. Developer has verified that it is due to the behaviour on the GQL API (shuffling order after edit number). Thus, the developer considered to leave it be as it takes bigger effort to handle it on the frontend and could have bigger impact on client side performance

## Screenshots
