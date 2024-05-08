class Xbox360CPU {
    constructor() {                                      // A Powerful Xbox 360 CPU Emulator beta
        this.registers = new Uint32Array(32);            // 32 Registers (idk)
        this.pc = 0;                                     // Program Counter
        this.halted = false;                             // Halt receptor
        this.devMode = true;                             // Dev Mode. ignores errors
        this.cache = new Map();                          // "Un-limited" cache
        this.baseFrequency = 3.2;                        // 3.2GHz
        this.memory = new Uint8Array(1024 * 1024 * 512); // 512 memory mb
        this.timers = {};                                // Timers Storage

        console.log(`
        $$\   $$\ $$\                           $$$$$$$\  
        $$ |  $$ |$$ |                          $$  ____| 
        \$$\ $$  |$$$$$$$\   $$$$$$\  $$\   $$\ $$ |      
         \$$$$  / $$  __$$\ $$  __$$\ \$$\ $$  |$$$$$$$\  
         $$  $$<  $$ |  $$ |$$ /  $$ | \$$$$  / \_____$$\ 
        $$  /\$$\ $$ |  $$ |$$ |  $$ | $$  $$<  $$\   $$ |
        $$ /  $$ |$$$$$$$  |\$$$$$$  |$$  /\$$\ \$$$$$$  |
        \__|  \__|\_______/  \______/ \__/  \__| \______/ 
                                                  
        ! DISCLAIMER !
        I'm not the Xbox 360 Creator,
        and this isn't affliated with
        Microsoft.

        !!WARNING!!
        If you paid for this program, you got scammed.
        All my Programs are free to use.
        And don't make a custom version of this program,
        if you want to do that, send a e-mail
        with all required informations:

        Custom Name?
        More instructions?
        And what you will modify.

        E-Mail: eduardoplays5495@outlook.com

        Any questions? send me a e-mail or look the README.md
        `);
    }

    loadProgram(program) {
        for (let i = 0; i < program.length; i++) {
            this.memory[i] = program[i];
        }
    }

    run() {
        while (!this.halted) {
            this.checkMemory();              // this stops when the code finalize. why, because xbox needed to clean the memory (in that case) this is a emulator.
            const instruction = this.fetchInstruction();
            if (instruction === 0xFF) break; // interruption (maybe)
            setTimeout(() => {
                this.decodeAndExecute(instruction);
            }, this.baseFrequency / 1000);
        }
    }

    fetchInstruction() {
        const instruction = this.memory[this.pc];
        this.pc++;
        return instruction;
    }

    decodeAndExecute(instruction) {
        if (instruction === 0x10) this.vecLoad();
        else if (instruction === 0x11) this.vecStore();
        else if (instruction === 0x12) this.vecAdd();
        else if (instruction === 0x13) null;                  // not done gpu emulator yet bro
        else if (instruction === 0x14) this.readXboxMemory();
        else if (instruction === 0x15) this.writeXboxMemory();
        else if (instruction === 0xF4) this.halted = true;
        else if (instruction === 0x16) this.branchIfEqual();
        else if (instruction === 0x17) this.branchIfNotEqual();
        else if (instruction === 0x18) this.incRegister();
        else if (instruction === 0x1A) this.decRegister();
        else if (instruction === 0x1B) this.mov();
        else if (instruction === 0x1C) this.add();
        else if (instruction === 0x1D) this.sub();
        else if (instruction === 0x1E) this.mul();
        else if (instruction === 0x1F) this.div();
        else if (instruction === 0x20) this.cos();
        else if (instruction === 0x21) this.sin();
        else if (instruction === 0x22) this.sina();
        else if (instruction === 0x23) this.cosa();
        else if (instruction === 0x24) this.log();
        else if (instruction === 0x25) this.exp();
        else if (instruction === 0x26) this.sqrt();
        else if (instruction === 0x27) this.abs();
        else if (instruction === 0x28) this.vectorDotProduct();
        else if (instruction === 0x29) this.vectorCrossProduct();
        else if (instruction === 0x2A) this.matrixMultiply();
        else if (instruction === 0x2B) this.scalarMultiply();
        else if (instruction === 0x2C) this.vectorNormalize();
        else if (instruction === 0x2D) this.vectorMagnitude();
        else if (instruction === 0x2E) this.matrixTranspose();
        else if (instruction === 0x2F) this.vectorAdd();
        else if (instruction === 0x31) this.vectorSubtract();
        else if (instruction === 0x32) this.bitwiseAnd();
        else if (instruction === 0x33) this.bitwiseOr();
        else if (instruction === 0x34) this.bitwiseXor();
        else if (instruction === 0x35) this.bitwiseNot();             
        else if (instruction === 0x36) this.shiftLeft();
        else if (instruction === 0x37) this.shiftRight();
        else if (instruction === 0x38) this.startTimer();
        else if (instruction === 0x3A) this.stopTimer();
        else if (instruction === 0x3B) this.pauseTimer();
        else if (instruction === 0x3C) this.resumeTimer();
        else if (instruction === 0x00) null;                   // nop
        else {
            if (this.devMode) {
                console.warn("[DEVMODE] Opcode not added or non-existent: " + instruction + " ignoring it. (may cause instability on your game)");
            } else if (!this.devMode) {
                console.error("Invalid instruction: " + instruction);
            }
        }
    }

    // Memory management
    readMemory(address) {
        if (this.cache.has(address)) {
            console.log(`CACHE: Read directly on cache - Endereço ${address}`);
            return this.cache.get(address);
        } else {
            console.log(`MEMORY: Read directly on memory - Address ${address}`);
            const value = this.memory[address];
            this.cache.set(address, value);
            return value;
        }
    }

    writeMemory(address, value) {
        console.log(`MEMORY: Write directly on memory - Address ${address} - Value ${value}`);
        this.memory[address] = value;
        this.cache.set(address, value);
    }

    // Math operations
    add() {
        const srcRegisterIndex1 = this.memory[this.pc];
        const srcRegisterIndex2 = this.memory[this.pc + 1];
        const destRegisterIndex = this.memory[this.pc + 2];
        const sum = this.registers[srcRegisterIndex1] + this.registers[srcRegisterIndex2];
        this.registers[destRegisterIndex] = sum;
        console.log(`ADD: addiction of R${srcRegisterIndex1} and R${srcRegisterIndex2} stored in R${destRegisterIndex}`);
        this.pc += 3;

        if (this.cache.has(destRegisterIndex)) {
            console.log(`CACHE: updating cache value to R${destRegisterIndex}`);
            this.cache.set(destRegisterIndex, sum);
        }
    }

    sub() {
        const srcRegisterIndex1 = this.memory[this.pc];
        const srcRegisterIndex2 = this.memory[this.pc + 1];
        const destRegisterIndex = this.memory[this.pc + 2];
        const difference = this.registers[srcRegisterIndex1] - this.registers[srcRegisterIndex2];
        this.registers[destRegisterIndex] = difference;
        console.log(`SUB: subtraction of R${srcRegisterIndex1} and R${srcRegisterIndex2} stored in R${destRegisterIndex}`);
        this.pc += 3;

        if (this.cache.has(destRegisterIndex)) {
            console.log(`CACHE: uptating cache value to R${destRegisterIndex}`);
            this.cache.set(destRegisterIndex, difference);
        }
    }

    div() {
        const srcRegisterIndex = this.memory[this.pc];
        const destRegisterIndex = this.memory[this.pc + 1];
        if (this.registers[srcRegisterIndex] !== 0) {
            this.registers[destRegisterIndex] /= this.registers[srcRegisterIndex];
            console.log(`DIV: Value divided of R${srcRegisterIndex} to R${destRegisterIndex}`);
        } else {
            if (this.devMode) {
                console.warn("Divide by zero. Ignoring cuz dev mode is on. (may cause instability)");
            } else if (!this.devMode) {
                console.error(`DIV: Division by zero.`);
            }
        }
        this.pc += 2;
    }

    mul() {
        const srcRegisterIndex = this.memory[this.pc];
        const destRegisterIndex = this.memory[this.pc + 1];
        this.registers[destRegisterIndex] *= this.registers[srcRegisterIndex];
        console.log(`MUL: Value multiplied by R${srcRegisterIndex} to R${destRegisterIndex}`);
        this.pc += 2;
    }

    cos() {
        const srcRegisterIndex = this.memory[this.pc];
        const destRegisterIndex = this.memory[this.pc + 1];
        const value = this.registers[srcRegisterIndex];
        this.registers[destRegisterIndex] = Math.cos(value);
        console.log(`COS: Cosseno of R${srcRegisterIndex} stored in R${destRegisterIndex}`);
        this.pc += 2;
    }

    sin() {
        const srcRegisterIndex = this.memory[this.pc];
        const destRegisterIndex = this.memory[this.pc + 1];
        const value = this.registers[srcRegisterIndex];
        this.registers[destRegisterIndex] = Math.sin(value);
        console.log(`SIN: Seno of R${srcRegisterIndex} stored in R${destRegisterIndex}`);
        this.pc += 2;
    }

    sina() {
        const srcRegisterIndex = this.memory[this.pc];
        const destRegisterIndex = this.memory[this.pc + 1];
        const value = this.registers[srcRegisterIndex];
        this.registers[destRegisterIndex] = Math.asin(value);
        console.log(`SINA: Arco seno of R${srcRegisterIndex} stored in R${destRegisterIndex}`);
        this.pc += 2;
    }

    cosa() {
        const srcRegisterIndex = this.memory[this.pc];
        const destRegisterIndex = this.memory[this.pc + 1];
        const value = this.registers[srcRegisterIndex];
        this.registers[destRegisterIndex] = Math.acos(value);
        console.log(`COSA: Arco cosseno of R${srcRegisterIndex} stored in R${destRegisterIndex}`);
        this.pc += 2;
    }

    log() {
        const srcRegisterIndex = this.memory[this.pc];
        const destRegisterIndex = this.memory[this.pc + 1];
        const value = this.registers[srcRegisterIndex];
        this.registers[destRegisterIndex] = Math.log(value);
        console.log(`LOG: Logarithm of R${srcRegisterIndex} stored in R${destRegisterIndex}`);
        this.pc += 2;
    }

    exp() {
        const srcRegisterIndex = this.memory[this.pc];
        const destRegisterIndex = this.memory[this.pc + 1];
        const value = this.registers[srcRegisterIndex];
        this.registers[destRegisterIndex] = Math.exp(value);
        console.log(`EXP: Exponential of R${srcRegisterIndex} stored in R${destRegisterIndex}`);
        this.pc += 2;
    }

    sqrt() {
        const srcRegisterIndex = this.memory[this.pc];
        const destRegisterIndex = this.memory[this.pc + 1];
        const value = this.registers[srcRegisterIndex];
        this.registers[destRegisterIndex] = Math.sqrt(value);
        console.log(`SQRT: Square root of R${srcRegisterIndex} stored in R${destRegisterIndex}`);
        this.pc += 2;
    }

    abs() {
        const srcRegisterIndex = this.memory[this.pc];
        const destRegisterIndex = this.memory[this.pc + 1];
        const value = this.registers[srcRegisterIndex];
        this.registers[destRegisterIndex] = Math.abs(value);
        console.log(`ABS: Absolute value of R${srcRegisterIndex} stored in R${destRegisterIndex}`);
        this.pc += 2;
    }

    // Xbox 360 Things
    vectorDotProduct() {
        const vector1Index = this.memory[this.pc];
        this.pc++;
        const vector2Index = this.memory[this.pc];
        this.pc++;
        const dotProduct = this.registers[vector1Index] * this.registers[vector2Index];
        this.registers[0] = dotProduct;
        console.log(`VECTOR_DOT_PRODUCT: Dot product of vector ${vector1Index} and vector ${vector2Index} stored in R0`);
    }

    vectorCrossProduct() {
        const vector1Index = this.memory[this.pc];
        this.pc++;
        const vector2Index = this.memory[this.pc];
        this.pc++;
        const dotProduct = this.registers[vector1Index] ^ this.registers[vector2Index];
        this.registers[0] = dotProduct;
        console.log(`VECTOR_CROSS_PRODUCT: Cross product of vector ${vector1Index} and vector ${vector2Index} stored in R0`);
    }

    scalarMultiply() {
        const scalarIndex = this.memory[this.pc];
        this.pc++;
        const matrixIndex = this.memory[this.pc];
        this.pc++;
        const resultMatrixIndex = this.memory[this.pc];
        this.pc++;

        const scalar = this.registers[scalarIndex];
        const matrix = [];
        for (let i = 0; i < 4; i++) {
            matrix[i] = [];
            for (let j = 0; j < 4; j++) {
                matrix[i][j] = this.registers[matrixIndex + (i * 4) + j];
            }
        }

        const resultMatrix = [];
        for (let i = 0; i < 4; i++) {
            resultMatrix[i] = [];
            for (let j = 0; j < 4; j++) {
                resultMatrix[i][j] = scalar * matrix[i][j];
            }
        }

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                this.registers[resultMatrixIndex + (i * 4) + j] = resultMatrix[i][j];
            }
        }

        console.log(`SCALAR_MULTIPLY: Multiplied scalar ${scalarIndex} by matrix ${matrixIndex}, result stored in R${resultMatrixIndex}`);
    }

    matrixMultiply() {
        const matrix1Index = this.memory[this.pc];
        this.pc++;
        const matrix2Index = this.memory[this.pc];
        this.pc++;
        const resultMatrixIndex = this.memory[this.pc];
        this.pc++;

        const matrix1 = [];
        for (let i = 0; i < 4; i++) {
            matrix1[i] = [];
            for (let j = 0; j < 4; j++) {
                matrix1[i][j] = this.registers[matrix1Index + (i * 4) + j];
            }
        }

        const matrix2 = [];
        for (let i = 0; i < 4; i++) {
            matrix2[i] = [];
            for (let j = 0; j < 4; j++) {
                matrix2[i][j] = this.registers[matrix2Index + (i * 4) + j];
            }
        }

        const resultMatrix = [];
        for (let i = 0; i < 4; i++) {
            resultMatrix[i] = [];
            for (let j = 0; i < 4; j++) {
                resultMatrix[i][j] = 0;
                for (let k = 0; k < 4; k++) {
                    resultMatrix[i][j] += matrix1[i][k] * matrix2[k][j];
                }
            }
        }

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                this.registers[resultMatrixIndex + (i * 4) + j] = resultMatrix[i][j];
            }
        }

        console.log(`MATRIX_MULTIPLY: Multiplied matrix ${matrix1Index} by ${matrix2Index}, result stored in R${resultMatrixIndex}`);
    }

    vectorNormalize() {
        const vectorIndex = this.memory[this.pc];
        this.pc++;
        const normalizedVectorIndex = this.memory[this.pc];
        this.pc++;

        const vector = [];
        let magnitude = 0;
        for (let i = 0; i < 3; i++) {
            vector[i] = this.registers[vectorIndex];
            magnitude += vector[i] * vector[i];
        }
        magnitude = Math.sqrt(magnitude);

        for (let i = 0; i < 3; i++) {
            this.registers[normalizedVectorIndex + i] = vector[i] / magnitude;
        }

        console.log(`VECTOR_NORMALAIZE: Normalized vector ${vectorIndex}, result stored in vector ${normalizedVectorIndex}`);
    }

    vectorMagnitude() {
        const vectorIndex = this.memory[this.pc];
        this.pc++;
        const magnitudeRegisterIndex = this.memory[this.pc];
        this.pc++;

        let magnitude = 0;
        for (let i = 0; i < 3; i++) {
            const component = this.registers[vectorIndex + i];
            magnitude += component * component;
        }
        magnitude = Math.sqrt(magnitude);

        this.registers[magnitudeRegisterIndex] = magnitude;
        console.log(`VECTOR_MAGNITUDE: Magnitude of vector ${vectorIndex} stored in R${magnitudeRegisterIndex}`);
    }

    matrixTranspose() {
        const matrixIndex = this.memory[this.pc];
        this.pc++;
        const resultMatrixIndex = this.memory[this.pc];
        this.pc++;

        const matrix = [];
        for (let i = 0; i < 4; i++) {
            matrix[i] = [];
            for(let j = 0; i < 4; j++) {
                matrix[i][j] = this.registers[matrixIndex + (i * 4) + j];
            }
        }

        const transposeMatrix = [];
        for (let i = 0; i < 4; i++) {
            transposeMatrix[i] = [];
            for (let j = 0; j < 4; j++) {
                transposeMatrix[i][j] = matrix[i][j];
            }
        }

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                this.registers[resultMatrixIndex + (i * 4) + j] = transposeMatrix[i][j];
            }
        }

        console.log(`MATRIX_TRANSPOSE: Transposed matrix ${matrixIndex}, result stored in R${resultMatrixIndex}`);
    }

    vectorAdd() {
        const vector1Index = this.memory[this.pc];
        this.pc++;
        const vector2Index = this.memory[this.pc];
        this.pc++;
        const resultVectorIndex = this.memory[this.pc];
        this.pc++;

        for (let i = 0; i < 3; i++) {
            this.registers[resultVectorIndex + i] = this.registers[vector1Index + i] + this.registers[vector2Index + i];
        }

        console.log(`VECTOR_ADD: Added vectors ${vector1Index} and ${vector2Index}, result stored in R${resultVectorIndex}`);
    }

    vectorSubtract() {
        const vector1Index = this.memory[this.pc];
        this.pc++;
        const vector2Index = this.memory[this.pc];
        this.pc++;
        const resultVectorIndex = this.memory[this.pc];
        this.pc++;

        for (let i = 0; i < 3; i++) {
            this.registers[resultVectorIndex + i] = this.registers[vector1Index + i] - this.registers[vector2Index + i];
        }

        console.log(`VECTOR_SUBTRACT: Subtracted vector ${vector1Index} from vector ${vector2Index}, result stored in R${resultVectorIndex}`);
    }

    vecLoad() {
        const address = this.memory[this.pc];
        this.pc++;
        const value = this.memory[address];
        console.log("VEC_LOAD: Loaded value =", value);
    }

    vecStore() {
        const address = this.memory[this.pc];
        this.pc++;
        const value = this.registers[0];
        this.memory[address] = value;
        console.log("VEC_STORE: Stored value=", value);
    }

    vecAdd() {
        const value1 = this.registers[0];
        const value2 = this.registers[1];
        const result = value1 + value2;
        this.registers[2] = result;
        console.log("VEC_ADD: Add result=", result);
    }

    readXboxMemory() {
        const address = this.memory[this.pc];
        this.pc++;
        const value = this.memory[address];
        this.registers[2] = value;
        console.log("READ_XBOX_MEMORY: Readed data =", value);
    }

    writeXboxMemory() {
        const address = this.memory[this.pc];
        this.pc++;
        const value = this.registers[0];
        this.memory[address] = value;
    }

    startTimer() {
        const timerId = this.memory[this.pc];
        this.pc++;
        const duration = this.memory[this.pc];
        this.pc++;

        if (this.timers.hasOwnProperty(timerId)) {
            if (this.devMode) {
                console.warn(`START_TIMER: Timer ${timerId} is already running.`);
            } else if (!this.devMode) {
                console.error(`START_TIMER: Timer ${timerId} is already running.`);
                return;
            }
        }

        this.timers[timerId] = setInterval(() => {
            console.log(`Timer ${timerId} elapsed.`);
            return true;
        }, duration);

        console.log(`START_TIMER: Timer ${timerId} started with duration ${duration} ms.`);
    }

    stopTimer() {
        const timerId = this.memory[this.pc];
        this.pc++;

        if (!this.timers.hasOwnProperty(timerId)) {
            if (this.devMode) {
                console.warn(`STOP_TIMER: Timer ${timerId} does not exist.`);
            } else if (!this.devMode) {
                console.error(`STOP_TIMER: Timer ${timerId} does not exist.`);
                return;
            }
        }

        clearInterval(this.timers[timerId]);
        delete this.timers[timerId];

        console.log(`STOP_TIMER: Timer ${timerId} stopped.`);
    }

    pauseTimer() {
        const timerId = this.memory[this.pc];
        this.pc++;

        if (!this.timers.hasOwnProperty(timerId)) {
            if (this.devMode) {
                console.warn(`PAUSE_TIMER: Timer ${timerId} does not exist.`);
            } else if (!this.devMode) {
                console.error(`PAUSE_TIMER: Timer ${timerId} does not exist.`);
                return;
            }
        }

        clearInterval(this.timers[timerId]);

        console.log(`PAUSE_TIMER: Timer ${timerId} paused.`);
    }

    resumeTimer() {
        const timerId = this.memory[this.pc];
        this.pc++;

        if (!this.timers.hasOwnProperty(timerId)) {
            if (this.devMode) {
                console.warn(`RESUME_TIMER: Timer ${timerId} does not exist.`);
            } else if (!this.devMode) {
                console.error(`RESUME_TIMER: Timer ${timerId} does not exist.`);
                return;
            }
        }

        const duration = this.memory[this.pc];
        this.pc++;

        this.timers[timerId] = setInterval(() => {
            console.log(`Timer ${timerId} elapsed.`);
        }, duration);

        console.log(`RESUME_TIMER: Timer ${timerId} resumed with new duration ${duration} ms.`);
    }

    // Basic CPU Operations
    branchIfEqual() {
        const value1 = this.registers[0];
        const value2 = this.registers[1];
        if (value1 === value2) {
            const address = this.memory[this.pc];
            this.pc = address;
            console.log("BRANCH_IF_EQUAL: Jump to address =", address);
        } else {
            this.pc++;
        }
    }

    branchIfNotEqual() {
        const value1 = this.registers[0];
        const value2 = this.registers[1];
        if (value1 !== value2) {
            const address = this.memory[this.pc];
            this.pc = address;
            console.log("BRANCH_IF_NOT_EQUAL: Jump to address =", address);
        } else {
            this.pc++;
        }
    }

    incRegister() {
        const registerIndex = this.memory[this.pc];
        this.registers[registerIndex]++;
        console.log(`INC_REGISTER: Register ${registerIndex} incremented`);
        this.pc++;
    }

    decRegister() {
        const registerIndex = this.memory[this.pc];
        this.registers[registerIndex]--;
        console.log(`DEC_REGISTER: Register ${registerIndex} decremented.`);
        this.pc++;
    }

    mov() {
        const srcRegisterIndex = this.memory[this.pc];
        const destRegisterIndex = this.memory[this.pc + 1];
        const value = this.registers[srcRegisterIndex];
        this.registers[destRegisterIndex] = value;
        console.log(`MOV: Value moved of R${srcRegisterIndex} to R${destRegisterIndex}`);
        this.pc += 2;

        if (this.cache.has(destRegisterIndex)) {
            console.log(`CACHE: updating cache value to R${destRegisterIndex}`);
            this.cache.set(destRegisterIndex, value);
        }
    }

    bitwiseAnd() {
        const operand1 = this.registers[this.memory[this.pc]];
        this.pc++;
        const operand2 = this.registers[this.memory[this.pc]];
        this.pc++;

        const result = operand1 & operand2;
        this.registers[this.memory[this.pc]] = result;
        this.pc++;

        console.log(`BITWISE_AND: Result of ${operand1} AND ${operand2} stored in R${this.memory[this.pc - 1]}: ${result}`);
    }

    bitwiseOr() {
        const operand1 = this.registers[this.memory[this.pc]];
        this.pc++;
        const operand2 = this.registers[this.memory[this.pc]];
        this.pc++;
        const result = operand1 | operand2;
        this.registers[this.memory[this.pc]] = result;
        this.pc++;
        console.log(`BITWISE_OR: Result of ${operand1} OR ${operand2} stored in register ${this.memory[this.pc - 1]}: ${result}`);
    }

    bitwiseXor() {
        const operand1 = this.registers[this.memory[this.pc]];
        this.pc++;
        const operand2 = this.registers[this.memory[this.pc]];
        this.pc++;
        const result = operand1 ^ operand2;
        this.registers[this.memory[this.pc]] = result;
        this.pc++;
        console.log(`BITWISE_XOR: Result of ${operand1} XOR ${operand2} stored in register ${this.memory[this.pc - 1]}: ${result}`);
    }

    bitwiseNot() {
        const operand = this.registers[this.memory[this.pc]];
        this.pc++;

        const result = ~operand;
        this.registers[this.memory[this.pc]] = result;
        this.pc++;

        console.log(`BITWISE_NOT: Result of NOT ${operand} stored in R${this.memory[this.pc - 1]}: ${result}`);
    }

    shiftLeft() {
        const value = this.registers[this.memory[this.pc]];
        this.pc++;

        const shiftAmount = this.registers[this.memory[this.pc]];
        this.pc++;

        const result = value << shiftAmount;
        this.registers[this.memory[this.pc]] = result;
        this.pc++;
        console.log(`SHIFT_LEFT: Result of shifting ${value} left by ${shiftAmount} stored in R${this.memory[this.pc - 1]}: ${result}`);
    }

    shiftRight() {
        const value = this.registers[this.memory[this.pc]];
        this.pc++;

        const shiftAmount = this.registers[this.memory[this.pc]];
        this.pc++;

        const result = value >> shiftAmount;
        this.registers[this.memory[this.pc]] = result;
        this.pc++;
        console.log(`SHIFT_RIGHT: Result of shifting ${value} right by ${shiftAmount} stored in R${this.memory[this.pc - 1]}: ${result}`);
    }

    // utils (like free mem)
    checkMemory() {
        const memoryUsage = this.memory.filter(value => value !== 0).length;
        const memorySize = this.memory.length;

        if (memoryUsage === memorySize) {
            console.log(`Using ${memoryUsage}MB of ${memorySize}MB`);
            console.warn("Memory Overloaded. Running Cleanup");
            this.freeMem();
        } else {
            console.log(`Using ${memoryUsage}KB/MB of ${memorySize}MB`);
        }
    }

    freeMem() {
        for (let i = 0; i < this.memory.length; i++) {
            if (this.memory[i] === 0x00) {
                this.memory[i] = 0xFF;
            }
        }
        console.log("Memory Cleaned")
    }

    logRegisters() {
        console.log(this.registers);
    }
}

const cpu = new Xbox360CPU();

// your program, example: 1 + 1 count
const program = [
    0x1B, 0x00, 0x01, 
    0x1C, 0x00, 0x02,
    0xFF // interruption
];

cpu.loadProgram(program);

cpu.run();
