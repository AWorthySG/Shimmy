# Changelog

All notable changes to this project are recorded here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- Brow-mapping selfie camera at `/brows/selfie`. It has a fixed green centre line, a mirrored pair of draggable yellow lines and two independent red lines. Head-pose and phone-level checks lock the shutter until the photo is straight. Accepted photos are sent to the artist's Telegram with a measurements file.
- Photo-library option on the brow selfie page. A chosen photo runs through the same face checks, and any check it fails is shown before sending. Large photos are resized to stay within the upload limit.
- `npm test` script for unit tests (`node --test`).
