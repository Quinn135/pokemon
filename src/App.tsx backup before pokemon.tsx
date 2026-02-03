"use client";

import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  // MenubarSub,
  // MenubarSubContent,
  // MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Field, FieldContent, FieldDescription, FieldGroup, FieldSeparator, FieldLegend, FieldSet, FieldLabel } from "@/components/ui/field";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils"

import { X, Minus, Square, Copy } from "lucide-react";

import { useEffect, useState } from "react";

import "./App.css";

export function App() {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") !== "false");

  const electron = (window as any).electron;
  const [devToolsOpen, setDevToolsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [maximized, setMaximized] = useState(false);

  const handleMinimize = () => electron?.minimize();
  const handleToggleMaximize = () => electron?.toggleMaximize();
  const handleClose = () => electron?.close();
  const isDevToolsOpen = async () => { return await electron?.isDevToolsOpen() };
  const toggleDevTools = async () => {
    electron?.toggleDevTools();
    setDevToolsOpen(await isDevToolsOpen());
    // window.setTimeout(async () => {
    // setDevToolsOpen(await isDevToolsOpen());
    // }, 100);
  };

  useEffect(() => {
    electron?.onMaximize(() => setMaximized(true));
    electron?.onUnmaximize(() => setMaximized(false));

    if (!darkMode) {
      document.body.classList.remove("dark");
    }

    (async () => {
      setDevToolsOpen(await isDevToolsOpen());
    })();
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

  return <>
    <Menubar className="drag rounded-none z-100 relative pointer-events-auto">
      <MenubarMenu>
        <MenubarTrigger className="noDrag">File</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarItem onSelect={() => setSettingsOpen(true)}>
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
    <div id="app" className="p-4 w-full h-full flex flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent>
          <form action={congratulate}>
            <FieldGroup>
              <FieldSet>
                <FieldLegend>Form</FieldLegend>
                <FieldDescription>I would highly recommend you put all of your personal data here</FieldDescription>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                    <Input id="fullName" name="fullName" placeholder="Type here..." required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="extra">Extra</FieldLabel>
                    <Textarea id="extra" name="extra" placeholder="Type here..." />
                    <FieldDescription>
                      Any other information you'd like to hand over, we'd be happy to accept!
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </FieldSet>
              <Field orientation={"horizontal"}>
                <Button type="submit">Submit</Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div >
    <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          {/* <CardAction>
            <Button variant={"destructive"}><X size={32} /></Button>
          </CardAction> */}
        </DialogHeader>
        <Label>
          <Switch id="devtools-toggle" checked={darkMode} onClick={toggleDarkMode} />
          Dark Mode
        </Label>
        <Label>
          <Switch id="devtools-toggle" checked={devToolsOpen} onCheckedChange={toggleDevTools} />
          Dev Tools
        </Label>
      </DialogContent>
    </Dialog>
  </>;
}

export default App;