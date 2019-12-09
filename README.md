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

## Droppers and Elevators

Data in plumber is moved around the 2d space in packets. These packets can move 1 unit in any cardinal direction per cycle. Up and down movements are controlled through droppers and elevators, and sideways movements are controlled through pushing and pulling operations.

The simplest use for droppers and elevators is moving packets up and down. When a packet is pushed into a dropper, it begins to move down. When a packet is pushed into an elevator, it begins to move up. Packets moving up or down will continue to do so until they are stopped, or reach the boundary of the 2d space.

If a packet moves downward into an elevator, is is pushed to both sides and stops moving down. If a packet moves upward into a dropper, it is pushed to both sides and stops moving up. Pushed packets move one space only, and are destroyed if they are not used by the unit being pushed to. All droppers on the top row of a program drop a `0` packet before the first cycle. Take this example program:

```
[][]
][][
```

It consists of 4 units: two droppers (`[]`) on the top row, and two elevators (`][`) on the bottom row. Both droppers will drop a `0` packet, which will then be picked up by the corresponding elevators, and pushed to the sides. Some will be pushed outside of the boundary, and these will do nothing. The others will be pushed into the opposite elevator, and sent up. Once received by the droppers, they will be pushed to each other, and the process will repeat to form an infinite loop.

This program would also work with any number of spaces between the two rows:

```
[][]



][][
```

This program would do the same thing, but much slower. The units must be next to each other horizontally, however, so this program would not work:

```
[]  []
][  ][
```

The packets would be pushed into an empty space, and destroyed.

## Pullers

Pullers (`=]` / `[=`) are one of the the most important units. They are used to take input and output, transport packets via pushing, and pull values from other units.

If a packet is pushed into the `=` side of a puller, it is pushed in the direction of the `]`. This can be used to create chains of pullers to transport packets horizontally. As a simple example, take this program:

```
    []
[]=][]
][[=][
```

A `0` packet will drop from the topmost dropper, and down to the elevator. The `[=` will push the packet into the leftmost elevator, sending it up to the dropper, pushing it into the `=]` puller, and dropping it from the rightmost dropper, forming an infinite loop.

If a packet is pushed into the `]` side of a puller, it is outputted unless it's negative. When a packet moves down into a puller, the packet to the `=` side of the puller is pulled and pushed to the `]` side. The downward packet is destroyed. If there is no packet, input is popped instead (if no more input exists, the result is `-1`). Take this program for example:

```
[]
=][=
```

A packet will be dropped from the dropper, and the leftmost puller will attempt to pull a packet from outside the boundary of the program. Since there are no packets there, input is taken. This value is then pushed to the `[` side of the rightmost puller, outputting it.

## Increment and Decrement

Increment (`] ` / ` [`) and decrement (`[ ` / ` ]`) units are some of the simplest. If a packet moves up or down through one, it is either incremented or decrmented (based on the direction the bracket is facing). If the bracket's flat side (the left side of `[` or right side of `]`) faces inward, it is an increment unit. This can be used as a trick to remeber the difference: inward, increment.

If a packet is pushed into either side of an increment or decrement unit, the operation is applied and it is dropped. As an example, this program will output a newline (10):

```
  []
] ][
]
]
]
]
]
]
]
]
]
][[=
```

## Conditional

Conditonal units (`=[` / `]=`) are similar to pullers, in that a packet pushed to the `=` side is pushed to the `[` side. However, as the name implies, this only happens if the packet's value is not `0`. However, if a packet is pushed to the `[` side, it is pushed to the `=` side unconditionally.

An easy way to remeber the difference between conditional (`=[`) and puller (`=]`) units is that a conditional ends in the forked side of the bracket. Conditional units fork between pushing and not pushing.

Here is a cat program, using conditional units:

```
[]
[]]=[]
=][]]
=]][][
```

This is a little hard to understand at first glance, so here's a (_syntactically invalid_) representation with spaces padding the units:

```
[]
[] ]= []
=] [] ]
=] ][ ][
```

A packet will first drop from the top dropper, and the puller on the third row will pop input. This will be pushed into the dropper and received by the elevator below. It will be pushed into the `]` side of the lowest puller, and outputted. It will also be sent upward by the rightmost elevator, incremented, and received by the rightmost dropper. If the value isn't 0, it will repeat the process.

## Branch Droppers

A branch dropper (`[[` / `]]`) can be used to create loops or duplicate a packet. When a packet is pushed into a branch dropper or moves downward into one, it is pushed in the direction the brackets face (left for `]`, right for `[`) and dropped. In both of these examples, two `0`s will be outputted:

```
[]
[[[=
][[=
```

```
[][=
][]]
=]][
```

A branch dropper can be used to simplify the cat program to this:

```
[]=[[]
 [[[[=
][][
```

The value pushed by the puller is pushed back into the `[` side of the puller, so only one is necessary. Because a branch dropper ignores upward moving packets, there is no need to ensure only one dropper drops a packet.

## Storage Units, Value Units, and Puller Mechanics

The storage unit, `==`, will hold the value of the last packet pushed to it until it is pulled. For example, take this program:

```
[]    []
    []][
    ][[]
    []][
=]===][=
```

The packet dropped by the dropper in the top right will take much longer to fall than the one on the left. When it reaches the puller, the `0` packet from the left will already be stored, and it will be outputted.

Pulling is the last thing done in each cycle. Pulling will do different things, depending on the unit being pulled from:

- Empty: Nothing
- Storage: Removes packet
- Value: `0` if pulling from ` ` side, `1` if pulling from `=` side
- Other: Reads value which will be pushed on next cycle

If nothing is or can be pulled, input is taken.

## Implementation

- Packets hold integers, and must be capable of holding negative integers
- Input must be positive
- Output is ignored if negative
- EOF is represented with `-1`

## Computational Class

Plumber is turning complete given a program of infinite size. Memory can be based off of storage units, constantly cycling feed tapes consisting of elevators and droppers, or other methods (such as infinite loops with branch droppers).

## Example Programs

### Infinite Loop

```
[]
[[]]
```

### Cat

```
[]=[[]
 [[[[=
][][
```

### Add Two Inputs

```
          []          []
          [][]  [][]  =][]
    []=][]=][[=]][
      [][===][  [][===[]
[][]   [        []    ][][
] [===][=]][     ]
][[=[=[=[=[=]=[]][=[[[][
    ][[=[=[=[==[[=[=][
          []]=][=][]
        = =]=]][[=[== 
```

### Hello, world! (Ungolfed)

```
[]
[[[[[[[[[[[[[[[[[[[[[[[[[[
] ] ] ] ] ] ] ] ] ] ] ] ] 
] ] ] ] ] ] ] ] ] ] ] ] ] 
] ] ] ] ] ] ] ] ] ] ] ] ] 
] ] ] ] ] ] ] ] ] ] ] ] ] 
] ] ] ] ] ] ] ] ] ] ] ] ] 
] ] ] ] ] ] ] ] ] ] ] ] ] 
] ] ] ] ] ] ] ] ] ] ] ] ] 
] ] ] ] ] ] ] ] ] ] ] ] ] 
] ] ] ] ] ] ] ] ] ] ] ] ] 
] ] ] ] ] ] ] ] ] ] ] ] ] 
] ] ] ] ] ] ] ] ] ] ] ] ] 
] ] ] ] ] ] ] ] ] ] ] ] ] 
] ] ] ] ] ] ] ] ] ] ] ] ] 
] ] ] ] ] ] ] ] ] ] ] ] ] 
] ] ] ] ] ] ] ] ] ] ] ] ] 
] ] ] ] ] ] ] ] ] ] ] ] ] 
] ] ] ] ] ] ] ] ] ] ] ] ] 
] ] ] ] ] ] ] ] ] ] ] ] ] 
] ] ] ] ] ] ] ] ] ] ] ] ] 
] ] ] ] ] ] ] ] ] ] ] ] ] 
] ] ] ] ] ] ] ] ] ] ] ] ] 
] ] ] ] ] ] ] ] ] ] ] ] ] 
] ] ] ] ] ] ] ] ] ] ] ] ] 
] ] ] ] ] ] ] ] ] ] ] ] ] 
] ] ] ] ] ] ] ] ] ] ] ] ] 
] ] ] ] ] ] ] ] ] ] ] ] ] 
] ] ] ] ] ] ] ] ] ] ] ] ] 
] ] ] ] ] ] ] ] ] ] ] ] ] 
] ] ] ] ] ] ] ] ] ] ] ] ] 
] ] ] ] ] ] ] ] ] ] ] ] ] 
] ] ] ] ] ] ] ] ] ] ] ] ] 
] ] ] ] ] ] ] ] ] ] ] ] ] 
] ] ] ] ] ]   ] ] ] ] ] ] 
] ] ] ] ] ]   ] ] ] ] ]   
] ] ] ] ] ]   ] ] ] ] ]   
] ] ] ] ] ]   ] ] ] ] ]   
] ] ] ] ] ]   ] ] ] ] ]   
] ] ] ] ] ]   ] ] ] ] ]   
] ] ] ] ] ]   ] ] ] ] ]   
] ] ] ] ] ]   ] ] ] ] ]   
] ] ] ] ] ]   ] ] ] ] ]   
] ] ] ] ] ]   ] ] ] ] ]   
] ] ] ] ] ]   ] ] ] ] ]   
] ] ] ] ] ]   ] ] ] ] ]   
] ] ] ] ]     ] ] ] ] ]   
] ] ] ] ]     ] ] ] ] ]   
] ] ] ] ]     ] ] ] ] ]   
] ] ] ] ]     ] ] ] ] ]   
] ] ] ] ]     ] ] ] ] ]   
] ] ] ] ]     ] ] ] ] ]   
] ] ] ] ]     ] ] ] ] ]   
] ] ] ] ]     ] ] ] ] ]   
] ] ] ] ]     ] ] ] ] ]   
] ] ] ] ]     ] ] ] ] ]   
] ] ] ] ]     ] ] ] ] ]   
] ] ] ] ]     ] ] ] ] ]   
] ] ] ] ]     ] ] ] ] ]   
] ] ] ] ]     ] ] ] ] ]   
] ] ] ] ]     ] ] ] ] ]   
] ] ] ] ]     ] ] ] ] ]   
] ] ] ] ]     ] ] ] ] ]   
] ] ] ] ]     ] ] ] ] ]   
] ] ] ] ]     ] ] ] ] ]   
] ] ] ] ]     ] ] ] ] ]   
] ] ] ] ]     ] ] ] ] ]   
] ] ] ] ]     ] ] ] ] ]   
] ] ] ] ]     ] ] ] ] ]   
] ] ] ] ]     ] ] ] ] ]   
] ] ] ] ]     ] ] ] ] ]   
] ] ] ] ]     ] ] ] ] ]   
] ] ] ] ]     ] ] ] ] ]   
] ] ] ] ]     ] ] ] ] ]   
  ] ] ] ]     ] ] ] ] ]   
  ] ] ] ]     ] ] ] ] ]   
  ] ] ] ]     ] ] ] ] ]   
  ] ] ] ]     ] ] ] ] ]   
  ] ] ] ]     ] ] ] ] ]   
  ] ] ] ]     ] ] ] ] ]   
  ] ] ] ]     ] ] ] ] ]   
  ] ] ] ]     ] ] ] ] ]   
  ] ] ] ]     ] ] ] ] ]   
  ] ] ] ]     ] ] ] ] ]   
  ] ] ] ]     ] ] ] ] ]   
  ] ] ] ]     ] ] ] ] ]   
  ] ] ] ]     ] ] ] ] ]   
  ] ] ] ]     ] ] ] ] ]   
  ] ] ] ]     ] ] ] ] ]   
  ] ] ] ]     ] ] ] ] ]   
  ] ] ] ]     ] ] ] ] ]   
  ] ] ] ]     ] ] ] ] ]   
  ] ] ] ]     ] ] ] ] ]   
  ] ] ] ]     ] ] ] ] ]   
  ] ] ] ]     ] ] ] ] ]   
  ] ] ] ]     ] ] ] ] ]   
  ] ] ] ]     ] ] ] ] ]   
  ] ] ] ]     ] ] ] ] ]   
  ] ] ] ]     ] ] ] ] ]   
  ] ] ] ]     ] ] ] ] ]   
  ] ] ] ]     ] ] ] ] ]   
  ] ] ] ]     ] ] ] ] ]   
  ] ] ] ]     ] ] ] ]     
    ] ] ]     ] ] ] ]     
    ] ] ]     ] ] ] ]     
    ] ] ]     ] ] ] ]     
    ] ] ]     ] ] ] ]     
    ] ] ]     ] ] ] ]     
    ] ] ]     ] ] ] ]     
    ] ] ]     ] ] ] ]     
        ]     ] ] ]       
        ]     ] ] ]       
        ]     ] ] ]       
              ]   ]       
              ]   ]       
              ]   ]       
              ]           
              ]           
              ]           
              ]           
              ]           
[[]=]=]=]=]=]=]=]=]=]=]=]=[=
  [[]=]=]=]=]=]=]=]=]=]=]=[=
    [[]=]=]=]=]=]=]=]=]=]=[=
      [[]=]=]=]=]=]=]=]=]=[=
        [[]=]=]=]=]=]=]=]=[=
          [[]=]=]=]=]=]=]=[=
            [[]=]=]=]=]=]=[=
              [[]=]=]=]=]=[=
                [[]=]=]=]=[=
                  [[]=]=]=[=
                    [[]=]=[=
                      [[]=[=
                        [[[=
```
