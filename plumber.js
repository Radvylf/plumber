function plumb(code, args) {
    var units = code.split(/\r?\n|\r/g).map(el => el.replace(/[^[\]=]/g, " ").padEnd(Math.ceil(el.length / 2) * 2, " ").match(/.{1,2}/g));
    {
        let max = units.reduce((acc, el) => Math.max(acc, el.length), 0);
        units = units.map(el => el.concat(...new Array(max - el.length).fill("  ")));
    }
    {
        let nargs = [];
        let num = function(arg) {
            if (typeof arg == "string")
                return arg.split("").map(el => el.codePointAt(0));
            else if (Number.isInteger(arg))
                return [arg];
            else
                return [0];
        };
        args = args.reverse().forEach(el => nargs.push(...num(el)));
        args = nargs;
    }
    var grid = new Array(units.length);
    var output = [];
    var alive = function(x, y) {
        var u = units[x][y];
        var g = grid[x][y];
        if (g[0][0] !== null || g[1][0] !== null || g[2][0] !== null || g[3][0] !== null || g[4][0] !== null || g[5][0] !== null)
            return true;
        if (["[]", "][", "=]", "[=", "=[", "]=", "[[", "]]"].includes(u) && g[6][0] !== null)
            return true;
        if (["[]", "][", "=]", "[=", "=[", "]="].includes(u) && g[7][0] !== null)
            return true;
        if ((u == "=]" || u == "[=") && g[8][0] !== null)
            return true;
        return false;
    };
    //
    for (let i = 0; i < grid.length; i++) {
        grid[i] = new Array(units[0].length);
        for (let u, j = 0; j < grid[i].length; j++) {
            u = units[i][j];
            grid[i][j] = [[null], [null], [null], [null], [null], [null]];
            if (u == "==" || u == "=]" || u == "[=" || u == "[[" || u == "]]")
                grid[i][j].push([null]);
            if (["[]", "][", "=]", "[=", "=[", "]="].includes(u))
                grid[i][j].push([null], [null]);
            if (i == 0 && u == "[]") {
                grid[i][j][2][0] = 0;
                grid[i][j][3][0] = 0;
            }
        }
    }
    do {
        /*{
            let s = "";
            for (let i = 0; i < grid.length; i++) {
                for (let d, g, j = 0; j < grid[i].length; j++) {
                    g = grid[i][j];
                    if (g[0][0] !== null) {
                        
                    } else if (g[2][0] !== null) {
                        
                    }
                }
                s += "\n";
            }
            console.log(s);
        }*/
        for (let i = 0; i < grid.length; i++) {
            for (let g, j = 0; j < grid[i].length; j++) {
                g = grid[i][j];
                if (g[0][0] !== null) {
                    if (i > 0)
                        grid[i - 1][j][0].push(g[0][0]);
                    g[0][0] = null;
                }
                if (g[1][0] !== null) {
                    if (i > 0)
                        grid[i - 1][j][1].push(g[1][0]);
                    g[1][0] = null;
                }
                if (g[2][0] !== null) {
                    if (i < grid.length - 1)
                        grid[i + 1][j][2].push(g[2][0]);
                    g[2][0] = null;
                }
                if (g[3][0] !== null) {
                    if (i < grid.length - 1)
                        grid[i + 1][j][3].push(g[3][0]);
                    g[3][0] = null;
                }
            }
        }
        //
        for (let i = 0; i < grid.length; i++) {
            for (let u, g, j = 0; j < grid[i].length; j++) {
                u = units[i][j];
                g = grid[i][j];
                g[0] = [g[0].pop()];
                g[1] = [g[1].pop()];
                g[2] = [g[2].pop()];
                g[3] = [g[3].pop()];
                if (u == "] " || u == " [") {
                    if (g[0][0] === undefined || g[1][0] === undefined || g[2][0] === undefined || g[3][0] === undefined)
                        return [i, j, "+"];
                    if (g[0][0] !== null)
                        g[0][0]++;
                    if (g[1][0] !== null)
                        g[1][0]++;
                    if (g[2][0] !== null)
                        g[2][0]++;
                    if (g[3][0] !== null)
                        g[3][0]++;
                } else if (u == "[ " || u == " ]") {
                    if (g[0][0] === undefined || g[1][0] === undefined || g[2][0] === undefined || g[3][0] === undefined)
                        return [i, j, "-"];
                    if (g[0][0] !== null)
                        g[0][0]--;
                    if (g[1][0] !== null)
                        g[1][0]--;
                    if (g[2][0] !== null)
                        g[2][0]--;
                    if (g[3][0] !== null)
                        g[3][0]--;
                } else if (u == "][") {
                    if (g[2][0] !== null)
                        if (j > 0)
                            g[6].push(g[2][0]);
                    if (g[3][0] !== null)
                        if (j < grid[i].length - 1)
                            g[7].push(g[3][0]);
                    g[2] = [null];
                    g[3] = [null];
                } else if (u == "[]") {
                    if (g[0][0] !== null)
                        if (j > 0)
                            g[6].push(g[0][0]);
                    if (g[1][0] !== null)
                        if (j < grid[i].length - 1)
                            g[7].push(g[1][0]);
                    g[0] = [null];
                    g[1] = [null];
                } else if (u == "=]" || u == "[=") {
                    if (g[2][0] !== null || g[3][0] !== null)
                        g[7][0] = 1;
                    g[2] = [null];
                    g[3] = [null];
                } else if (u == "[[") {
                    if (g[2][0] !== null || g[3][0] !== null)
                        if (j > 0)
                            g[6].push(g[2][0]);
                } else if (u == "]]") {
                    if (g[2][0] !== null || g[3][0] !== null)
                        if (j < grid[i].length - 1)
                            g[6].push(g[3][0]);
                }
            }
        }
        for (let i = 0; i < grid.length; i++) {
            for (let u, g, j = 0; j < grid[i].length; j++) {
                u = units[i][j];
                g = grid[i][j];
                if (u == "==") {
                    if (g[4][0] !== null || g[5][0] !== null) {
                        if (g[4][0] !== null && g[5][0] !== null)
                            g[6][0] = Math.random() < 0.5 ? g[4][0] : g[5][0];
                        else
                            g[6][0] = (g[4][0] === null ? g[5][0] : g[4][0]);
                    }
                } else if (u == "] " || u == " [") {
                    if (g[4][0] !== null || g[5][0] !== null) {
                        if (g[4][0] !== null && g[5][0] !== null) {
                            g[2][0] = g[4][0] + 1;
                            g[3][0] = g[5][0] + 1;
                        } else {
                            g[2][0] = g[3][0] = (g[4][0] === null ? g[5][0] : g[4][0]) + 1;
                        }
                    }
                } else if (u == "[ " || u == " ]") {
                    if (g[4][0] !== null || g[5][0] !== null) {
                        if (g[4][0] !== null && g[5][0] !== null) {
                            g[2][0] = g[4][0] - 1;
                            g[3][0] = g[5][0] - 1;
                        } else {
                            g[2][0] = g[3][0] = (g[4][0] === null ? g[5][0] : g[4][0]) - 1;
                        }
                    }
                } else if (u == "[]") {
                    if (g[4][0] !== null || g[5][0] !== null) {
                        if (g[4][0] !== null && g[5][0] !== null) {
                            g[2][0] = g[4][0];
                            g[3][0] = g[5][0];
                        } else {
                            g[2][0] = g[3][0] = (g[4][0] === null ? g[5][0] : g[4][0]);
                        }
                    }
                } else if (u == "][") {
                    if (g[4][0] !== null || g[5][0] !== null) {
                        if (g[4][0] !== null && g[5][0] !== null) {
                            g[0][0] = g[4][0];
                            g[1][0] = g[5][0];
                        } else {
                            g[0][0] = g[1][0] = (g[4][0] === null ? g[5][0] : g[4][0]);
                        }
                    }
                } else if (u == "=]") {
                    if (g[4][0] !== null)
                        g[6].push(g[4][0]);
                    if (g[5][0] !== null)
                        g[8].push(g[5][0]);
                } else if (u == "[=") {
                    if (g[4][0] !== null)
                        g[8].push(g[4][0]);
                    if (g[5][0] !== null)
                        g[6].push(g[5][0]);
                } else if (u == "=[") {
                    if (g[4][0])
                        g[7].push(g[4][0]);
                    if (g[5][0] !== null)
                        g[6].push(g[5][0]);
                } else if (u == "]=") {
                    if (g[4][0] !== null)
                        g[7].push(g[4][0]);
                    if (g[5][0])
                        g[6].push(g[5][0]);
                } else if (u == "[[") {
                    if (g[4][0] !== null || g[5][0] !== null) {
                        if (g[4][0] !== null && g[5][0] !== null) {
                            g[2][0] = g[4][0];
                            g[6].push(g[3][0] = g[5][0]);
                        } else {
                            g[6].push(g[2][0] = g[3][0] = (g[4][0] === null ? g[5][0] : g[4][0]));
                        }
                    }
                } else if (u == "]]") {
                    if (g[4][0] !== null || g[5][0] !== null) {
                        if (g[4][0] !== null && g[5][0] !== null) {
                            g[6].push(g[2][0] = g[4][0]);
                            g[3][0] = g[5][0];
                        } else {
                            g[6].push(g[2][0] = g[3][0] = (g[4][0] === null ? g[5][0] : g[4][0]));
                        }
                    }
                }
                g[4] = [null];
                g[5] = [null];
            }
        }
        for (let i = 0; i < grid.length; i++) {
            for (let u, g, j = 0; j < grid[i].length; j++) {
                u = units[i][j];
                g = grid[i][j];
                if (u == "[]" || u == "][" || u == "=[" || u == "]=") {
                    if (g[6][0] !== null)
                        if (j > 0)
                            grid[i][j - 1][5].push(g[6][0]);
                    if (g[7][0] !== null)
                        if (j < grid[i].length - 1)
                            grid[i][j + 1][4].push(g[7][0]);
                    g[6] = [[null].concat(g[6].slice(1)).pop()];
                    g[7] = [[null].concat(g[7].slice(1)).pop()];
                } else if (u == "=]") {
                    if (g[6][0] !== null)
                        if (j < grid[i].length - 1)
                            grid[i][j + 1][4].push(g[6][0]);
                    if (g[8][0] !== null)
                        if (g[8][0] >= 0)
                            output.push(g[8][0]);
                    g[8] = [[null].concat(g[8].slice(1)).pop()];
                } else if (u == "[=") {
                    if (g[6][0] !== null)
                        if (j > 0)
                            grid[i][j - 1][5].push(g[6][0]);
                    if (g[8][0] !== null)
                        if (g[8][0] >= 0)
                            output.push(g[8][0]);
                    g[8] = [[null].concat(g[8].slice(1)).pop()];
                } else if (u == "[[") {
                    if (g[6][0] !== null)
                        if (j < grid[i].length - 1)
                            grid[i][j + 1][4].push(g[6][0]);
                    g[6] = [[null].concat(g[6].slice(1)).pop()];
                } else if (u == "]]") {
                    if (g[6][0] !== null)
                        if (j > 0)
                            grid[i][j - 1][5].push(g[6][0]);
                    g[6] = [[null].concat(g[6].slice(1)).pop()];
                }
            }
        }
        for (let i = 0; i < grid.length; i++) {
            for (let u, g, j = 0; j < grid[i].length; j++) {
                u = units[i][j];
                g = grid[i][j];
                g[4] = [[null].concat(g[4].slice(1)).pop()];
                g[5] = [[null].concat(g[5].slice(1)).pop()];
            }
        }
        {
            let state = function(x, y, d) {
                var g = grid[x][y];
                var u = units[x][y];
                if (u == "==")
                    return g[6][0];
                else if (u == "[]" || u == "][")
                    return g[d + 2][0];
                else if (u == "=]" || u == "=[" || u == "]]" || u == "[ " || u == "] ")
                    return g[4][0];
                else if (u == "[=" || u == "]=" || u == "[[" || u == " ]" || u == " [")
                    return g[5][0];
                else if (u == "= " || u == " =")
                    return (d == 4) == (u[0] == "=") ? 1 : 0;
                else
                    return null;
            };
            for (let i = 0; i < grid.length; i++) {
                for (let u, g, j = 0; j < grid[i].length; j++) {
                    u = units[i][j];
                    g = grid[i][j];
                    if (u == "[=") {
                        if (g[7][0]) {
                            if (j < grid[i].length - 1 && state(i, j + 1, 4) !== null) {
                                if (j > 0)
                                    g[6].push(state(i, j + 1, 4));
                            } else {
                                if (j > 0)
                                    g[6].push(args.length ? args.pop() : -1);
                                else
                                    args.pop();
                            }
                        }
                        g[6] = [[null].concat(g[6].slice(1)).pop()];
                        g[7] = [null];
                    } else if (u == "=]") {
                        if (g[7][0]) {
                            if (j > 0 && state(i, j - 1, 5) !== null) {
                                if (j < grid[i].length - 1)
                                    g[6].push(state(i, j - 1, 5));
                            } else {
                                if (j < grid[i].length - 1)
                                    g[6].push(args.length ? args.pop() : -1);
                                else
                                    args.pop();
                            }
                        }
                        g[6] = [[null].concat(g[6].slice(1)).pop()];
                        g[7] = [null];
                    }
                }
            }
        }
    } while (grid.find((el, x) => el.find((el, y) => alive(x, y))));
    return output;
}