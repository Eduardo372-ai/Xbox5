# xbox5
A Powerful Xbox 360 Emulator. Now, with no graphics.

I want to make the mot realistic possible.

!! WARNING !! This is under development, no iso suported, and no games suported. because idk how to organize the opcodes. idk the vecAdd opcode.

# Emulated Specifications
A Powerful "CPU" @3.2GHz
A Cache Map with "Infinity" Space
A Memory with 512MB
DevMode (not emulated, but devmode ignores errors)
Program Counter
32 Registers (idk)

# How i have that dumb idea?
i Was boring on YouTube watching Brazillian Content. cuz im Brazillian,
and i was so boring and i have that idea.

# How to use?
Look at opcode table in "opcodetable.md" and program the program.
if "opcodetable.md" not available, look at code cpu.js line 68 or look the code and you will see that opcodes
like:

```javascript
const { Xbox360CPU } = require("<path_to_cpu.js");

const cpu = new Xbox360CPU();

// your program, example: 1 + 1 count
const program = [
    0x1B, 0x00, 0x01, 
    0x1C, 0x00, 0x02,
    0xFF // interruption
];

cpu.loadProgram(program);

cpu.run();
```

# Questions
Q: This program is a RAT ( Remote access trojan )?

A: No, i literaly programed this on vanilla javascript. NO EXTERNAL LIBRARIES

Q: How many lines you coded this?

A: 708 Lines

Q: This taked long?

A: Much long that i was expecting. 2 FUCKIN' DAYS (and it will be aproximately 1 Month to finish the first version. ah)

Q: How much it use space?

A: 26 kilobytes (KB)

Q: How to run?

A: If the update "browser graphics" don't ready, you needed node.js or a browser with javascript support.

FOR BROWSERS:

Open a HTTP-SERVER on this program dir, and open the http-server link (why, browsers use CORS thing.)

And go to the console tab in inspect

FOR NODE.JS

Open command prompt in this dir
type: "node your_index_file.js"
and it will start.
