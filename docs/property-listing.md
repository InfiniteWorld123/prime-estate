# Property and Listing Management

## Scope

This module manages the agency's internal properties and their public
sale or rental listings.

The MVP supports residential properties in Germany:

- Apartment
- House

## Property Rules

- A property is an internal administrative record.
- Visitors never access properties directly.
- Every property has a generated UUID.
- Every property has a generated reference such as `PE-000001`.
- A property is either agency-owned or belongs to an external client.
- An external property requires one primary contact.
- The complete German address is always stored internally.
- A property can be archived only when it has no active listings.
- An archived property can be restored.

## Property Deletion

A property can be permanently deleted only when:

- None of its listings have ever been published.
- It has no inquiries.
- It has no viewing bookings.
- Its draft listings are deleted first.

Once a property enters the public business workflow, it can only be
archived and cannot be permanently deleted.

## Listings

- A property can have multiple listings throughout its history.
- A property can have one active sale listing and one active rental
  listing at the same time.
- It cannot have two non-archived listings of the same type.
- Rental prices represent monthly base rent.
- The only supported currency is EUR.

## Listing Lifecycle

- DRAFT
- PUBLISHED
- ARCHIVED

An archived listing has one outcome:

- SOLD
- RENTED
- WITHDRAWN

Sale listings accept `SOLD` or `WITHDRAWN`.
Rental listings accept `RENTED` or `WITHDRAWN`.

When a sale listing becomes sold, an active rental listing for the same
property is automatically archived as withdrawn.

## Drafts and Publication

Draft listings may be incomplete.

Publishing requires:

- Complete internal property address
- Property type
- Living area
- Price
- Title
- Description
- Slug
- Cover image

Draft listings that have never been published may be permanently deleted.

## Public Visibility

- Only published listings appear in public search results.
- The exact address is hidden by default.
- The admin may choose to display the exact address.
- Sold and rented listing pages remain publicly accessible.
- Sold and rented listings do not accept inquiries or bookings.
- Withdrawn listing pages return `404 Not Found`.
- Properties are never exposed through a public API.

## SEO

Each listing supports:

- Slug
- SEO title
- SEO description

Missing SEO values are generated from the listing title and description.
A published slug cannot be changed.

## Features

Properties and features have a many-to-many relationship.

Examples:

- Pool
- Gym
- Garage
- Garden
- Balcony
- Elevator
- Basement
- Furnished

## Images

- Images belong to properties and are shared by their listings.
- A property can have multiple ordered images.
- A property can have only one cover image.
- Image files are stored outside PostgreSQL.
- PostgreSQL stores the storage key and image metadata.