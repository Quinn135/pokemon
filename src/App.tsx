"use client";

import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./components/ui/dialog";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

import { cn } from "@/lib/utils"

import { X, Minus, Square, Copy } from "lucide-react";

import { useEffect, useState } from "react";

import "./App.css";

class Move {
  public name: String;
  public type: String;
  public power: number
  public accuracy: number;
  public ppCharge: number;

  constructor(name: String, type: String, power: number, accuracy: number, ppCharge: number) {
    this.name = name;
    this.type = type;
    this.power = power;
    this.accuracy = accuracy;
    this.ppCharge = ppCharge;
  }
}

class Pokemon {
  public name: string;
  public img: string;
  public type: string;

  public level: number;
  public maxHP: number;
  public currentHP: number;
  public speed: number;
  public pp: number; // mana

  // stats
  public defense: number;
  public attack: number;
  public attacks: Array<Move>; // name, power, accuracy, pp charge

  public fainted: boolean = false;

  // attack - power, accuracy, pp charge
  constructor(name: string, img: string, type: string, level: number, maxHP: number, speed: number, attack: number, defense: number, attacks: Array<Move>) {
    this.name = name;
    this.img = img;
    this.type = type;
    this.level = level;

    this.maxHP = maxHP;
    this.currentHP = maxHP;
    this.pp = 10; // default mana

    this.speed = speed;
    this.attacks = attacks;
    this.attack = attack;
    this.defense = defense;
  }

  public takeDamage(damage: number): number {
    const newHP = Math.max(0, this.currentHP - damage);
    this.currentHP = newHP;

    if (newHP <= 0) {
      this.fainted = true;
    }

    return newHP;
  }

  public attackOther(other: Pokemon, move: Move, setLogs: Function): { hit: boolean; damageDealt: number } {
    const damage = ((2 * this.level / 5 + 2) * move.power * this.attack / other.defense) / 50 + 2;
    const hit = Math.random() < move.accuracy / 100;

    if (hit) {
      setLogs((prevLogs: { text: string; i: number; }[]) => {
        const nextIndex = prevLogs.length > 0 ? prevLogs[0].i + 1 : 0;
        return [
          {
            text: `${this.name} attacked ${other.name} with ${move.name} and sent ${Math.round(damage)} damage!`,
            i: nextIndex,
          },
          ...prevLogs,
        ];
      });

      other.takeDamage(damage);
      return { hit: true, damageDealt: damage };
    } else {
      setLogs((prevLogs: { text: string; i: number; }[]) => {
        const nextIndex = prevLogs.length > 0 ? prevLogs[0].i + 1 : 0;
        return [
          {
            text: `${this.name} tried to attack ${other.name} with ${move.name}, but missed!`,
            i: nextIndex,
          },
          ...prevLogs,
        ];
      });

      return { hit: false, damageDealt: 0 };
    }
  }

  public reset() {
    this.currentHP = this.maxHP;
    this.pp = 10;
  }
}

const pokemons: Pokemon[] = [
  // new Pokemon(
  //   /* name */ "Simisage",
  //   /* type */ "Grass",
  //   /* level */ 16,
  //   /* maxHP */ 155,
  //   /* speed */ 45,
  //   /* attack */ 98,
  //   /* defense */ 63,
  //   /* moves */[
  //     new Move("Tackle", "Normal", /*pwr*/ 40, /*acry*/ 100, /*pp*/ 35),
  //     new Move("Lick", "Ghost", /*pwr*/ 30, /*acry*/ 100, /*pp*/ 30),
  //     new Move("Vine Wip", "Grass", /*pwr*/ 45, /*acry*/ 100, /*pp*/ 25),
  //     new Move("Bullet Seed", "Grass", /*pwr*/ 25, /*acry*/ 100, /*pp*/ 30),
  //   ]),
  // new Pokemon(
  //   /* name */ "Greedent",
  //   /* type */ "Normal",
  //   /* level */ 41,
  //   /* maxHP */ 120,
  //   /* speed */ 20,
  //   /* attack */ 95,
  //   /* defense */ 95,
  //   /* moves */[
  //     new Move("Bite", "Dark", /*pwr*/ 60, /*acry*/ 100, /*pp*/ 25),
  //     new Move("Tackle", "Normal", /*pwr*/ 40, /*acry*/ 100, /*pp*/ 35),
  //     new Move("Body Slam", "Normal", /*pwr*/ 85, /*acry*/ 100, /*pp*/ 15),
  //     new Move("Bullet Seed", "Grass", /*pwr*/ 25, /*acry*/ 100, /*pp*/ 30),
  //   ]),
  new Pokemon(
    /* name */ "Fearow",
    /* img */ "https://img.pokemondb.net/artwork/avif/fearow.avif",
    /* type */ "Normal Flying",
    /* level */ 8,
    /* maxHP */ 65,
    /* speed */ 100,
    /* attack */ 90,
    /* defense */ 65,
    /* moves */[
      new Move("Drill Run", "Ground", /*pwr*/ 80, /*acry*/ 95, /*pp*/ 10),
      new Move("Peck", "Flying", /*pwr*/ 35, /*acry*/ 100, /*pp*/ 35),
      new Move("Pluck", "Flying", /*pwr*/ 60, /*acry*/ 100, /*pp*/ 20),
      new Move("Assurance", "Dark", /*pwr*/ 60, /*acry*/ 100, /*pp*/ 10),
    ]),
  new Pokemon(
    /* name */ "Pidgeot",
    /* img */ "https://img.pokemondb.net/artwork/avif/pidgeot.avif",
    /* type */ "Normal Flying",
    /* level */ 1,
    /* maxHP */ 83,
    /* speed */ 101,
    /* attack */ 80,
    /* defense */ 75,
    /* moves */[
      new Move("Gust", "Flying", /*pwr*/ 40, /*acry*/ 100, /*pp*/ 35),
      new Move("Hurricane", "Flying", /*pwr*/ 110, /*acry*/ 50, /*pp*/ 10),
      new Move("Quick Attack", "Normal", /*pwr*/ 40, /*acry*/ 100, /*pp*/ 30),
      new Move("Tackle", "Normal", /*pwr*/ 40, /*acry*/ 100, /*pp*/ 35),
    ]),
  new Pokemon(
    /* name */ "Meowth",
    /* img */ "https://img.pokemondb.net/artwork/avif/meowth.avif",
    /* type */ "Normal",
    /* level */ 34,
    /* maxHP */ 40,
    /* speed */ 90,
    /* attack */ 45,
    /* defense */ 35,
    /* moves */[
      new Move("Pay Day", "Normal", /*pwr*/ 40, /*acry*/ 100, /*pp*/ 20),
      new Move("Bite", "Dark", /*pwr*/ 60, /*acry*/ 50, /*pp*/ 25),
      new Move("Slash", "Normal", /*pwr*/ 70, /*acry*/ 100, /*pp*/ 20),
      new Move("Take Down", "Normal", /*pwr*/ 90, /*acry*/ 85, /*pp*/ 20),
    ]),
];

// const choice1 = pokemons[0];
// const choice2 = pokemons[1];
// const choices = pokemons;

export function App() {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") !== "false");

  const electron = (window as any).electron;

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [maximized, setMaximized] = useState(false);

  const handleMinimize = () => electron?.minimize();
  const handleToggleMaximize = () => electron?.toggleMaximize();
  const handleClose = () => electron?.close();
  const isDevToolsOpen = async () => { return await electron?.isDevToolsOpen() };
  const toggleDevTools = async () => {
    electron?.toggleDevTools();
  };

  useEffect(() => {
    electron?.onMaximize(() => setMaximized(true));
    electron?.onUnmaximize(() => setMaximized(false));

    if (!darkMode) {
      document.body.classList.remove("dark");
    }
  }, []);

  const congratulate = (formData: FormData) => {
    const fullName = formData.get("fullName");
    const extra = formData.get("extra");
    alert(`Congratulations, ${fullName}!\n\nWe have received all of your personal data:\n\n${extra}`);
  }

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);

    if (newDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }

    localStorage.setItem("darkMode", newDarkMode ? "true" : "false");
  }

  const windowBtnClass = "noDrag h-full rounded-none border-none px-4.5";

  const [turn, setTurn] = useState(-1);
  const [hps, setHPs] = useState([-1, -1]);
  const [gameOver, setGameOver] = useState(false);
  const [logs, setLogs] = useState([{ text: "Game has started!", i: 0 }]);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const [lineupsPicked, setLineupsPicked] = useState(false);
  const [lineups, setLineups] = useState<Pokemon[][]>([[], []]);
  const [currentPokemons, setCurrentPokemons] = useState<number[]>([]);

  return <>
    <Toaster richColors />
    <Menubar className="drag rounded-none z-100 fixed w-full pointer-events-auto">
      <MenubarMenu>
        <MenubarTrigger className="noDrag">File</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarItem onSelect={async () => {
              setSettingsOpen(true);
            }}>
              Settings
            </MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarItem onSelect={handleClose}>
              Exit
              <MenubarShortcut>Alt+F4</MenubarShortcut>
            </MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
      <div className="w-full"></div>
      <div className="flex flex-row flex-nowrap h-full">
        <Button className={windowBtnClass} variant="ghost" onClick={handleMinimize}>
          <Minus className="size-3" />
        </Button>
        <Button className={windowBtnClass} variant="ghost" onClick={handleToggleMaximize}>
          {maximized ? <Copy className="size-3" /> : <Square className="size-3 opacity-75" />}
        </Button>
        <Button className={cn(windowBtnClass, "px-4")} variant="destructive" onClick={handleClose}>
          <X className="size-4" />
        </Button>
      </div>
    </Menubar >
    <div id="app" className="pt-9 w-full h-screen overflow-y-auto flex flex-col items-center">
      {!lineupsPicked ?
        <>
          <div className="h-10 p-4 mb-4 flex flex-row w-full justify-between">
            <span>
              Pick your lineup
            </span>
          </div>
          <div className="grid grid-rows-2 grid-cols-1 sm:grid-cols-2 sm:grid-rows-1 w-full">
            {
              [0, 1].map((pIndex) => {
                const border = pIndex == 0; // if left than yeah, otherwise no

                const pokemonNames = pokemons.map((p) => p.name);

                return (
                  <div key={pIndex} className={cn("sm:row-start-2 sm:col-span-1 p-4 flex flex-col h-fit min-h-full items-center", border ? "border-r" : "")}>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const elems = (e.target as any).elements;
                      const keys = Object.keys(elems);
                      const psArray = keys.filter((k) => elems[k] instanceof HTMLInputElement && elems[k].name.startsWith("pokemon")).map((key) => elems[key].value);

                      const psObjects = psArray.map((pName) => {
                        const p = pokemons.filter((p) => p.name == pName)[0];
                        return new Pokemon(p.name, p.img, p.type, p.level, p.maxHP, p.speed, p.attack, p.defense, p.attacks);
                      });

                      setLineups((prevLineups) => {
                        const l = [...prevLineups];
                        l[pIndex] = [...prevLineups[pIndex], ...psObjects];

                        if (l[1 - pIndex].length > 0) {
                          setLineupsPicked(true);
                          const c = [0, 0];
                          setCurrentPokemons(c);
                          setTurn(Number(l[1][c[1]].speed > l[0][c[0]].speed));
                          setHPs([l[0][c[0]].currentHP, l[1][c[1]].currentHP]);
                        }

                        return l;
                      });

                    }}>
                      <fieldset disabled={lineupsPicked || lineups[pIndex].length > 0}>
                        <Card className="flex flex-col max-w-125 min-w-80 overflow-hidden">
                          <CardHeader>
                            <CardTitle className="text-lg">Player {pIndex + 1} Lineup</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {
                              [0, 1, 2, 3].map((i) => {
                                return (
                                  <div className="py-4 border-b flex flex-col gap-1" key={i}>
                                    <span>Pokemon {i + 1}:</span>
                                    <Combobox required name={`pokemon-${pIndex}-${i}`} items={pokemonNames}>
                                      <ComboboxInput placeholder="Select a Pokemon" />
                                      <ComboboxContent style={{ maxHeight: "90vh", height: "40rem" }}>
                                        <ComboboxEmpty>No items found.</ComboboxEmpty>
                                        <ComboboxList style={{ maxHeight: "90vh", height: "40rem" }}>
                                          {(item) => (
                                            <ComboboxItem key={item} value={item}>
                                              <Card className="flex flex-col w-full">
                                                <CardHeader>
                                                  <CardTitle>{item}</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                  {
                                                    pokemons.filter((p) => p.name == item).map((p, index) => {
                                                      return (
                                                        <div key={index} className="flex flex-col">
                                                          <img src={p.img} alt={p.name} className="h-40 mb-2" />
                                                          <span>Type: {p.type}</span>
                                                          <span>Level: {p.level}</span>
                                                          <span>Max HP: {p.maxHP}</span>
                                                          <span>Speed: {p.speed}</span>
                                                          <span>Attack: {p.attack}</span>
                                                          <span>Defense: {p.defense}</span>
                                                        </div>
                                                      )
                                                    })
                                                  }
                                                </CardContent>
                                              </Card>
                                            </ComboboxItem>
                                          )}
                                        </ComboboxList>
                                      </ComboboxContent>
                                    </Combobox>
                                  </div>
                                );
                              })
                            }

                            <div className="w-full flex flex-row justify-end pt-4">
                              <Button className="cursor-pointer" type="submit" onClick={(e) => {
                                // ...
                              }}>Submit</Button>
                            </div>
                          </CardContent>
                        </Card>
                      </fieldset>
                    </form>
                  </div>
                );
              })
            }
          </div>
        </>
        :
        <>
          <div className="h-10 p-4 mb-4 flex flex-row w-full justify-between">
            <span className={gameOver ? "text-red-500" : ""}>
              {gameOver ? "Game over!" : `It is currently player ${turn + 1}'s turn (${lineups[turn][currentPokemons[turn]].name})`}
            </span>
            {/* <Button variant={"destructive"} className="cursor-pointer" onClick={() => {
              setResetDialogOpen(true);
            }}>Reset</Button> */}
          </div>
          <div className="grid grid-rows-2 grid-cols-1 sm:grid-cols-2 sm:grid-rows-1 w-full">
            {
              [lineups[0][currentPokemons[0]], lineups[1][currentPokemons[1]]].map((p, pIndex) => {
                const border = pIndex == 0; // if left than yeah, otherwise no
                // p = pokemon by the way

                return (
                  <div key={pIndex} className={cn("sm:row-start-2 sm:col-span-1 p-4 flex flex-col h-fit min-h-full items-center", border ? "border-r" : "")}>
                    <Card className="flex flex-col max-w-125 min-w-60 overflow-hidden">
                      <CardHeader>
                        <span className="text-lg">Pokemon {currentPokemons[pIndex] + 1} / 4</span>
                        <img src={p.img} alt={p.name} className="h-40" />
                        <CardTitle className={cn("text-lg", hps[pIndex] <= 0 ? "text-red-500" : "")}>
                          {p.name} <span className="text-sm font-normal">({p.type})</span>
                          <br />
                          <span className={hps[pIndex] > 0 ? "text-green-500" : "text-red-500"}>{Math.ceil(hps[pIndex])}HP</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col">
                        <span>Speed: {p.speed}</span>
                        <span>Attack: {p.attack}</span>
                        <span>Defense: {p.defense}</span>
                      </CardContent>
                      <CardHeader>
                        <CardTitle className="text-lg">Moves</CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col">
                        <div className="flex flex-wrap gap-4 justify-center">
                          {p.attacks.map((move, mIndex) => {
                            let maxPower = Math.max(...pokemons.flatMap((pokemon) => pokemon.attacks.map((move) => move.power))); // makes array of the powers -> finds max
                            let maxAccuracy = Math.max(...pokemons.flatMap((pokemon) => pokemon.attacks.map((move) => move.accuracy))); // makes array of the powers -> finds max
                            let maxPP = Math.max(...pokemons.flatMap((pokemon) => pokemon.attacks.map((move) => move.ppCharge))); // makes array of the powers -> finds max

                            return (
                              <Card onClick={((turn == pIndex) && !gameOver) ? (() => {
                                const otherIndex = Number(!pIndex);
                                const attackResult = p.attackOther(lineups[otherIndex][currentPokemons[otherIndex]], p.attacks[mIndex], setLogs);

                                // Update HPs immediately BEFORE changing turn
                                const updatedHPs = [lineups[0][currentPokemons[0]].currentHP, lineups[1][currentPokemons[1]].currentHP];
                                setHPs(updatedHPs);

                                // Switch turn
                                const nextTurn = turn == 0 ? 1 : 0;
                                setTurn(nextTurn);

                                // Check if any Pokemon fainted
                                if (updatedHPs[pIndex] <= 0 || updatedHPs[otherIndex] <= 0) {
                                  const c = [currentPokemons[0], currentPokemons[1]];
                                  c[nextTurn] += 1; // Increment the WINNER's Pokemon index

                                  if (c[nextTurn] > 3) {
                                    // All Pokemon fainted - game over
                                    setGameOver(true);
                                    setLogs((prevLogs: { text: string; i: number; }[]) => {
                                      const nextIndex = prevLogs.length > 0 ? prevLogs[0].i + 1 : 0;
                                      return [
                                        {
                                          text: `${lineups[otherIndex][currentPokemons[otherIndex]].name} has fainted! ${p.name} has won the battle!`,
                                          i: nextIndex,
                                        },
                                        ...prevLogs,
                                      ];
                                    });
                                  } else {
                                    // Send out next Pokemon
                                    setCurrentPokemons(c);
                                    setHPs([
                                      lineups[0][c[0]].currentHP,
                                      lineups[1][c[1]].currentHP
                                    ]);
                                    setLogs((prevLogs: { text: string; i: number; }[]) => {
                                      const nextIndex = prevLogs.length > 0 ? prevLogs[0].i + 1 : 0;
                                      return [
                                        {
                                          text: `${lineups[otherIndex][currentPokemons[otherIndex]].name} has fainted! Go, ${lineups[nextTurn][c[nextTurn]].name}!`,
                                          i: nextIndex,
                                        },
                                        ...prevLogs,
                                      ];
                                    });
                                  }
                                }
                              }) : (() => { })} key={mIndex} className={cn("w-full max-w-50 transition", ((turn == pIndex) && !gameOver) ? "cursor-pointer hover:bg-input/20 active:bg-input/40" : "bg-input/60")}>
                                <CardHeader>
                                  <CardTitle>
                                    <span className="text-red-400">{move.name}</span> - <span className="text-xs font-normal text-inherit">{move.type}</span>
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col">
                                  <span>Power: <b style={{ color: `rgb(${255 - move.power / maxPower * 255}, ${move.power / maxPower * 255}, 0)` }}>{move.power}</b></span>
                                  <span>Accuracy: <b style={{ color: `rgb(${255 - move.accuracy / maxAccuracy * 255}, ${move.accuracy / maxAccuracy * 255}, 0)` }}>{move.accuracy}</b></span>
                                  <span>PP: <b style={{ color: `rgb(${255 - move.ppCharge / maxPP * 255}, ${move.ppCharge / maxPP * 255}, 0)` }}>{move.ppCharge}</b></span>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })
            }
          </div>
          <div className="w-180 max-w-full p-4">
            <Card className="h-80">
              <CardHeader>
                <CardTitle>
                  Logs
                </CardTitle>
              </CardHeader>
              <CardContent className="w-full flex flex-col overflow-y-auto flex-1">
                {
                  logs.map((x, index) => {
                    return (
                      <span key={index} className={cn("p-2 border-b w-full text-sm", x.i % 2 == 0 ? "bg-input" : "")}><span className="mr-2 text-neutral-500 text-xs font-mono">{x.i}</span>{x.text}</span>
                    )
                  })
                }
              </CardContent>
            </Card>
          </div>
        </>}
    </div >
    <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <Label>
          <Switch id="devtools-toggle" checked={darkMode} onClick={toggleDarkMode} />
          Dark Mode
        </Label>
        <Label>
          <Button id="devtools-toggle" onClick={toggleDevTools}>Toggle</Button>
          Dev Tools
        </Label>
      </DialogContent>
    </Dialog>
    {/* <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
        </DialogHeader>
        <span>This will reset the match, and you will lose your progress</span>
        <div className="flex flex-row w-full gap-2 mt-4">
          <div className="w-full"></div>
          <Button className="cursor-pointer" onClick={() => setResetDialogOpen(false)}>Cancel</Button>
          <Button variant={"destructive"} className="cursor-pointer" onClick={() => {
            pokemons.map((p) => p.reset());
            setHPs([lineups[0][currentPokemons[0]].currentHP, lineups[1][currentPokemons[1]].currentHP]);
            setTurn(Number(lineups[1][currentPokemons[1]].speed > lineups[0][currentPokemons[0]].speed));
            setGameOver(false);
            setLogs([{ text: "Game has started!", i: 0 }])
            setResetDialogOpen(false);

            toast.success("Game has been reset!", { position: "top-center" });
          }}>Reset</Button>
        </div>
      </DialogContent>
    </Dialog> */}
  </>;
}

export default App;