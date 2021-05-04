"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** Show the submit your own story form when clicking on "submit" link in the navbar */

function navSubmitClick(e) {
  console.debug("navSubmitClick", e);
  hidePageComponents();
  $allStoriesList.show();
  $submitStoryForm.show();
}

$navSubmit.on("click", navSubmitClick);

/** Show favorited stories on click of "favorites" from nav-bar */

function navFavoritesClick(e) {
  console.debug("navFavoritesclick", e);
  hidePageComponents();
  favoriteListOnPage();
}

$body.on("click", "#nav-favorites", navFavoritesClick);

/** Show own stories on click of "User's Stories" from nav-bar */

function navOwnStoriesClick(e) {
  console.debug("navOwnStories", e);
  hidePageComponents();
  putUserStoriesOnPage();
  $ownStories.show();
}

$body.on("click", "#nav-user-stories", navOwnStoriesClick);

/** Hide everything on the page except the profile on the click of "profile" */

function navProfileClick(e) {
  console.debug("navProfileClick", e);
  hidePageComponents();
  $userProfile.show();
}

$navUserProfile.on("click", navProfileClick);