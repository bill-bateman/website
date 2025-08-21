---
title: "Sensor Watch"
subtitle: "tech / sensor_watch"
date: "2024-04-02"
category: "tech"
summary: "Messing around with the Sensor Watch - a board swap for the Casio F-91W."
---

[Sensor Watch](https://www.sensorwatch.net/) is a board swap for the Casio F-91W by [Oddly Specific Objects](https://www.oddlyspecificobjects.com/) (Joey Castillo). 

I wanted some programmable watch that I could tinker with and make it work just how I wanted it. My main requirements, other than being hackable, was a watch I could take everywhere: skiing, backpacking, travelling, etc. Meaning waterproofness and battery life are very important.

Compared to other hackable watches (mainly PineTime, Watchy, BangleJS), the Sensor Watch has the benefits of better waterproofness and longer battery life (~1 year compared to ~1 week). The LCD segment screen and general aesthetic is also charmingly old-school.

I was also interested in playing around with extra sensors, but the Sensor Watch Lite (red board) that I bought comes with a temperature sensor, and doesn't have the 9 pin connector of the original.

# Board Swap

The first part of the mod is swapping the board. There's a great video showing the steps in the [docs](https://www.sensorwatch.net/docs/).

![Old vs New Board](/images/sensorwatch1.jpeg)
<p class="caption">Sensor Watch board vs Casio board.</p>

There's only a little bit of soldering required for the buzzer to work. A thin strip of metal connects the board to the buzzer (which is on the backplate of the case). So we have to remove the connector from the original board, then solder it to the Sensor Watch board.

![Sensor Watch Lite Board](/images/sensorwatch3.jpeg)
<p class="caption">Back side of the board, showing the buzzer piece just before attaching it.</p>

After that, you just have to put the watch back together.

![Watch Disasembled](/images/sensorwatch2.jpeg)
<p class="caption">The disassembled watch.</p>

# Firmware Update

The [Movement firmware](https://github.com/joeycastillo/Sensor-Watch/) comes loaded onto the board. But it's super easy to [fork](https://github.com/bill-bateman/Sensor-Watch) and get it to do whatever you want. The main changes I made are:

- Custom watch face that optionally hides seconds.
- Edit tomato (pomodoro) face to have long breaks (20 mins) every 4th focus session.
- Edit interval face based on my exercise routines.
- Add custom signal tune.
- Show BELL indicator for alarms instead of SIGNAL.

After a quick `make`, flashing the board is pretty easy, but does require the watch to be disassembled. The small tab in the board can connect via micro USB to a computer. The board is mounted, and then you just drag a build artifact from the computer to the board. That's it!

# Backlight Spreader

One of the problems with the F91-W is the backlight only lights maybe half the screen. I got a [diffuser](https://www.etsy.com/ca/listing/1448973768/back-light-spreader-for-casio-f-91w-a) from Etsy.

![Backlight Pre-Mod](/images/sensorwatch4.jpeg)
<p class="caption">The stock backlight (left) vs the modded backlight (right).</p>

# Watch Strap

The stock strap is kind of ugly. The pins are only 18mm, but I wanted a 20mm Nato strap. So I got a [JaysAndKays adapter](https://www.ebay.ca/str/jaysandkays) which actually looks really good. 

# Final Look

Here's the watch at the end.

![Backlight Post-Mod](/images/sensorwatch5.jpeg)
