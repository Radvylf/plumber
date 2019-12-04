# Plumber

Plumber is an esolang based upon packets moving around in a 2d space. This space consists of a grid of 2-character wide units. Units are made up of the character set `[= ]`, and any characters not in this set (excluding newlines/carriage returns) are replaced with spaces.

## Syntax

There are 16 possible units. They are listed here (spaces replaced with `.` for readability):

- Empty (`..`)
- Storage (`==`)
- Dropper (`[]`)
- Elevator (`][`)
- Increment (`].` / `.[`)
- Decrement (`[.` / `.]`)
- Puller (`=]` / `[=`)
- Conditional (`=[` / `]=`)
- Branch Dropper (`[[` / `]]`)
- Value (`=.` / `.=`)

Each line of a program will be padded with spaces to the length of the longest line, rounded up to a multiple of two.

## Control Flow

