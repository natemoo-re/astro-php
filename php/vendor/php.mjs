import setup from './php-web.js';
import { fileURLToPath } from 'node:url';

const STR = "string";
const NUM = "number";
const EOF = `?>EOF`;

export class PHP {
    _initPromise;
    call;
    
    stdout = [];
    stderr = [];

    async init() {
        if (this._initPromise) return this._initPromise;

        this._initPromise = setup({
            locateFile(name) {
                const file = fileURLToPath(new URL(`./${name}`, import.meta.url));
                return file;
            },
            onAbort: function (reason) {
                console.error("WASM aborted: " + reason);
            },
            print: (...chunks) => {
                if (chunks.at(-1) === EOF) {
                    const output = this.stdout.join('\n');
                    this.clear();
                    return this.ret(output);
                }
                this.stdout.push(...chunks);
            },
            printErr: (...chunks) => {
                this.stderr.push(...chunks);
            },
        }).then(({ ccall }) => {
            ccall("pib_init", NUM, [STR], []);
            this.call = ccall;
            return;
        })
        return this._initPromise;
    }

    async run(code) {
        if (!this.call) throw new Error(`Run init() first!`);
        return new Promise(resolve => {
            this.ret = resolve;
            this.call("pib_run", NUM, [STR], [`?>${code}${EOF}`]);
        });
    }

    clear() {
        if (!this.call) throw new Error(`Run init() first!`);
        this.call("pib_refresh", NUM, [], []);
        this.stdout = [];
        this.sterr = [];
    }
}
