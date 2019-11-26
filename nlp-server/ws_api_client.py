#!/usr/bin/env python3

# ============================
# Spacy.io - WS Client example
# ----------------------------
# Author: Kyle Derby MacInnis
#
# 2019 (c) Kyle Derby MacInnis
# ============================

import os
import asyncio
import websockets
import curses, time

name = ''
# ws_uri = "ws://localhost:8765"
ws_uri = os.environ['WS_PROTOCOL']+os.environ['WS_HOST']+":"os.environ['WS_PORT']
#-------------------------------------- (Read CHARs No Keyboard Enter)
async def read_stdin(name):
    uri = ws_uri
    async with websockets.connect(uri,ping_interval=5) as websocket:
        try:
            stdscr = curses.initscr()
            curses.cbreak()
            curses.noecho()
            stdscr.keypad(1)
            x = 0
            y = 0
            while True: 
                ch = stdscr.getch()           
                # Check Keypress     
                if ch == curses.KEY_ENTER or ch == 10 or ch == 13:
                    break
                elif ch == curses.KEY_BACKSPACE or chr(ch) == '\b' or chr(ch) == '\x7f':
                    name = name[:-1]
                else:
                    name += chr(ch)
                    x += 1

                # Clear Window
                stdscr.clear()
                stdscr.addstr(0,0,name)
                stdscr.refresh()

                # Send to NLP Server
                await websocket.send(name)
                # Get Feedback
                ret = await asyncio.wait_for(websocket.recv(), timeout=10)

                # Display Feedback (below)
                stdscr.addstr(20,0,ret)
        except: raise
        finally:
            curses.nocbreak()
            stdscr.keypad(0)
            curses.echo()
            curses.endwin()
    
#--------------------------------------
asyncio.get_event_loop().run_until_complete(read_stdin(name))