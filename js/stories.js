"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

let story = {};

function generateStoryMarkup(story, showDeleteBtn = false, isFavorite = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  //if user is logged in --> show favorite/not-favorite star
  const showStar = Boolean(currentUser);

  return $(`
      <li id="${story.storyId}">
        ${showDeleteBtn ? getDeleteBtnHTML() : ""}
        ${showStar ? getStarHTML(isFavorite) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Make delete button HTML for story */
function getDeleteBtnHTML() {
  return `
    <span class="trash-can">
      <i class="fas fa-trash-alt"></i>
    </span>`;
}

/** Make favorite/not-favorite star for story */
function getStarHTML(isFavorite) {
  // const isFavorite = user.isFavorite(story); NOT NEEDED WITH NEW CLASS METHOD FROM MODELS.JS
  const starType = isFavorite ? "fas" : "far";

  return `
    <span class="star">
      <i class="${starType} fa-star"></i>
      </span>`;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Handle the deletion of a story */
async function deleteStory(e) {
  console.debug("deleteStory");

  const $closestLi = $(e.target).closest("li");
  const storyId = $closestLi.attr("id");

  await storyList.removeStory(currentUser, storyId);

  //re-generate story list
  await putUserStoriesOnPage();
}

$ownStories.on("click", ".trash-can", deleteStory);

/** Handles the form submission for #submit-story-form -- gathers the data from the form and adds story to the page */

async function addNewStoryToPage(e) {
  console.debug("addNewStoryToPage");
  e.preventDefault();

  //getting the information from the form
  const title = $("#story-title").val();
  const author = $("#story-author").val();
  const url = $("#story-url").val();
  const username = currentUser.username;
  const createdStoryData = {title, author, url, username};

  const created = await storyList.addStory(currentUser, createdStoryData);

  const $created = generateStoryMarkup(created);
  $allStoriesList.prepend($created);

  //hide the form and reset form fields
  $submitStoryForm.slideUp("slow");
  $submitStoryForm.trigger("reset");

}

$submitStoryForm.on("submit", addNewStoryToPage);

/******************
 * Functionality for list of user's own stories
 */

function putUserStoriesOnPage() {
  console.debug("putUserStoriesOnPage");

  $ownStories.empty();

  if(currentUser.ownStories.length === 0) {
    $ownStories.append("<h5>No stories added by user yet!</h5>");
  } else {
    //loop through all of users stories and generate HTML
    for (let story of currentUser.ownStories) {
      let isFav = currentUser.isFavorite(story);
      let $story = generateStoryMarkup(story, true, isFav);
      $ownStories.append($story);
    }
  }
  $ownStories.show();
}

/*****************
 * Functionality for favorites list and starr/un-starr a story
 */

/** Put favorite list on the page */

function favoriteListOnPage() {
  console.debug("favoriteListOnPage");

  $favoritesL.empty();

  if(currentUser.favorites.length === 0) {
    $favoritesL.append("<h5>No favorites in the list yet!</h5>");
  } else {
    //loop through all of the user's favorite and generate HTML
    for (let story of currentUser.favorites) {
      let isOwnStory = currentUser.isOwnStory(story);
      const $story = generateStoryMarkup(story, isOwnStory, true);
      $favoritesL.append($story);
    }
  }
  $favoritesL.show();
}

/** Handle favorite/un-favorite a story */

async function toggleStoryFavorite(e) {
  console.debug("toggleStoryFavorite");

  const $tgt = $(e.target);
  const $closestLi = $tgt.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);

  // see if the item is already favorited (checking by presence of star)
  if ($tgt.hasClass("fas")) {
    // currently a favorite: remove from user's fav list and change star
    await currentUser.deleteFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  } else {
    // currently not a favorite: do the opposite
    await currentUser.favorite(story);
    $tgt.closest("i").toggleClass("fas far");
  }
}

$storiesList.on("click", ".star", toggleStoryFavorite);