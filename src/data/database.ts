import { debug } from 'debug';

import { cache } from './cache';
import { FeedSingleton } from './models';
import { sampleData } from './sample-data';

const logger = debug('app:Database');
logger.log = console.log.bind(console);

/*                  BEGIN NEWS ITEMS                      */

export function getNewsItem(id) {
  return sampleData.newsItems.find(newsItem => newsItem.id === id);
}

export function createNewsItem(newsItem) {
  sampleData.newsItems.push(newsItem);

  return newsItem;
}

//                  NEWS ITEM MUTATIONS

export function upvoteNewsItem(id, userId) {
  // Upvote the News Item in the DB
  const newsItem = cache.getNewsItem(id);

  if (newsItem && !newsItem.upvotes.includes(userId)) {
    newsItem.upvotes.push(userId);
    newsItem.upvoteCount += 1;
    cache.setNewsItem(id, newsItem);
  }

  return newsItem;
}

export function unvoteNewsItem(id, userId) {
  const newsItem = cache.getNewsItem(id);

  if (newsItem && !newsItem.upvotes.includes(userId)) {
    newsItem.upvotes.splice(newsItem.upvotes.indexOf(userId), 1);
    newsItem.upvoteCount -= 1;
    cache.setNewsItem(id, newsItem);
  }

  return newsItem;
}

export function hideNewsItem(id: number, userId) {
  logger(`Hiding News Item ${id} by ${userId}`);

  const newsItem = cache.getNewsItem(id);
  const user = cache.getUser(userId);

  if (user && !user.hides.includes(id) && newsItem && !newsItem.hides.includes(userId)) {
    user.hides.push(id);
    cache.setUser(id, user);

    newsItem.hides.push(userId);
    cache.setNewsItem(id, newsItem);

    logger(`Hid News Item ${id} by ${userId}`);
  } else {
    throw new Error(`Data error, user has already hidden ${id} by ${userId}`);
  }

  return newsItem;
}

export function submitNewsItem(id, newsItem) {
  // Submit the News Item in the DB
  if (cache.setNewsItem(id, newsItem)) {
    FeedSingleton.new.unshift(id);
    FeedSingleton.new.pop();
    return newsItem;
  }

  throw new Error('Unable to submit News Item.');
}

/*                  END NEWS ITEMS                      */

/*                     BEGIN FEED                         */

export function getNewNewsItems(first, skip) {
  return sampleData.new.slice(skip, skip + first).map((postId, index) => ({
    ...getNewsItem(postId),
    rank: skip + index + 1,
  }));
}

export function getTopNewsItems(first, skip) {
  return sampleData.newsItems.slice(skip, skip + first);
}

export function getHotNews() {
  return sampleData.newsItems;
}

export function getNewsItems() {
  return sampleData.newsItems;
}

/*                     END FEED                         */

/*                   BEGIN USERS                        */

export function getUser(id) {
  return sampleData.users.find(user => user.id === id);
}

export function getUsers() {
  return sampleData.users;
}

export function createUser(user) {
  sampleData.users.push(user);

  return user;
}

/*                    END USERS                         */
