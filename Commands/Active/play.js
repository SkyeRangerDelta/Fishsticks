const Discord = require('discord.js');
const config = require('../../Modules/Core/corecfg.json');
const chs = require('../../Modules/fs_channels.json');

const ytdl = require('ytdl-core');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    //MUSIC SYSTEM VARIABLES
    const memberVC = msg.member.voiceChannel;
    
    fishsticks.playlist = fishsticks.queue.get(msg.guild.id);

    var hangoutVC = fishsticks.channels.get(chs.hangoutVC);
    var channelSpawner = fishsticks.channels.get(chs.fs_vcclone);
    var ranger = fishsticks.users.get("107203929447616512");
    var logger = fishsticks.channels.get(chs.musiclog);

    var song;
    var songInfo;

    var playerSongTitle;

    let engmode = fishsticks.engmode;
    let mattybmode = fishsticks.mattybmode;

    console.log("[MUSI-SYS] Play command recognized from user " + msg.author.tag + ".");
    console.log("[MATB-mod] MattyB Mode is currently: " + fishsticks.mattybmode);

    //ACTIVE FUNCTIONS
    function denied() {
        console.log("[MUSI-SYS] Play command rejected.");

        msg.reply("Request denied. You have to join a tempch channel first!\n\n*If this request was made from a temporary channel, Fishsticks has been restarted at some point and you need to recreate your channel for the music player to work.*").then(sent => sent.delete(30000));
    }

    async function accept() {
        console.log("[MUSI-SYS] Play command granted.");

        try {
            console.log("[MUSI-SYS] Attempting to gather song info...");

            songInfo = await ytdl.getInfo(cmd[0]);
            song = {
                title: songInfo.title,
                url: songInfo.video_url
            }

            playerSongTitle = song.title;
            playerSongTitle = playerSongTitle.toLowerCase();
        }
        catch (error) {
            console.log("[MUSI-SYS] Failed to collect song information.");
        }

        if (mattybmode = true) {
            var mattybentries = ["mattybraps", "mattyb", "matt b", "matthew david morris", "mattew morris", "matthew morris", "mat b", "mattb", "matthew", "mattbraps",
            "that terrible rapper", "#overhyped", "#why"];

            var mattybsongs = ["right in front of you", "gone", "friend zone", "little bit", "turn up the track", "spend it all on you", "stuck in the middle", "on my own",
            "hey matty", "can't get you off my mind", "shoulda coulda woulda", "live for today", "california dreamin", "trust me", "shine", "true colors", "thats the way",
            "right now i'm missing you", "you are my shining star", "blue skies", "life is unfair", "the king", "now kids", "video game", "imma be", "clique (cover)", "clique",
            "crush on you", "my oh my", "you make my heart skip", "royal wedding", "sugar sugar", "i just wanna love you", "moment", "be mine", "never too young", "far away",
            "so alive", "ms. jackson", "ms jackson", "goliath", "you", "flyin high", "guaranteed", "right on time", "back in time", "slow down", "low key", "that girl is mine",
            "hooked on you", "little bit (song)", "little bit(song)", "little bit", "turned out the lights", "talk dirty", "my first girlfriend", "see you again", "the good life",
            "ride it", "without you here", "to the top", "clap", "juicy", "be right there", "forever and always", "shake it off", "turn it up", "the royal wedding song", "i'm mattyb",
            "im mattyb", "burnout", "fancy", "enie meenie", "as long as you love me", "santa claus is coming to town (cover)", "santa claus is coming to town", "sants claus is coming to town",
            "sants claus is coming to town (cover)", "bad blood", "blank space", "boyfriend"];

            for (var p = 0; p < mattybentries.length; p++) {
                if ((songInfo.title.toLowerCase().includes(mattybentries[p]))) {
                    console.log("[MATB-MOD] Name caught.");

                    if ((songInfo.title.toLowerCase().includes(mattybentries[p])) && fishsticks.playrejects == 0) {
                        msg.reply("Oh dear. As GlaDOS would say: If we're to blow up, let's at least blow up with some dignity. - aka, we're not playing that.");
                        fishsticks.playrejects++;
                        return;
                    }
                    else if (fishsticks.playrejects == 1) {
                        msg.reply("Oh we're playing this game? Ok...let's go. Still not playing that.");
                        fishsticks.playrejects++;
                        return;
                    }
                    else if (fishsticks.playrejects == 2) {
                        msg.reply("Alright, here we go. Let's start deducting respect points: -5. How low can you go? Not playing that!");
                        fishsticks.playrejects++;
                        return;
                    }
                    else if (fishsticks.playrejects == 3) {
                        msg.reply("That's another 5. You know, you're really good at this. Still not playing it!");
                        fishsticks.playrejects++;
                        return;
                    }
                    else if (fishsticks.playrejects == 4) {
                        msg.reply("Listen, I'm getting a little concerned. Here, lemme have 10 more respect points (-10), because I'm not gonna play that.");
                        fishsticks.playrejects++;
                        return;
                    }
                    else if (fishsticks.playrejects == 5) {
                        msg.reply("Your mental health may be called into question. This is the 6th time now (and another -10) that I'm not going to play that!");
                        fishsticks.playrejects++;
                        return;
                    }
                    else if (fishsticks.playrejects == 6) {
                        msg.reply("-10 more points. We might need to step this up. Do you enjoy doing this to yourself? Not playing it!");
                        fishsticks.playrejects++;
                        return;
                    }
                    else if (fishsticks.playrejects == 7) {
                        msg.reply("I mean, I guess if you get a kick out of it, we can keep going... (-15 respect points). I will not yield.");
                        fishsticks.playrejects++;
                        return;
                    }
                    else if (fishsticks.playrejects == 8) {
                        msg.reply("I wonder how much better your time could be spent than with me here trying to play a song. (-15 respect points). I like having you around too.");
                        fishsticks.playrejects++;
                        return;
                    }
                    else if (fishsticks.playrejects == 9) {
                        msg.reply("Wow, you've spent the last 10 play commands trying to get me to do this. Alright (-30 respect points). We'll do this. Let's go. I will not yield.");
                        fishsticks.playrejects++;
                        return;
                    }
                    else if (fishsticks.playrejects >= 10) {
                        msg.reply("Attempt " + (fishsticks.playrejects + 1) + ": minus " + (fishsticks.playrejects * 5) + " respect points. (It only gets worse).");
                        fishsticks.playrejects++;
                        return;
                    }
                }
            }

            for (var k = 0; k < mattybsongs.length; k++) {
                if ((songInfo.title.toLowerCase().includes(mattybsongs[k])) || song.title.toLowerCase().includes(mattybsongs[k])) {
                    console.log("[MATB-MOD] Song title caught.");

                    if ((songInfo.title.toLowerCase().includes(mattybsongs[k])) == fishsticks.playrejects == 0) {
                        msg.reply("Thought you were slick ey? Nope, not playing it!");
                        fishsticks.playrejects++;
                        return;
                    }
                }
            }
        }

        if (songInfo == null) {
            console.log("[TEMP-CHA] Caught an error at invalid songInfo.");
            msg.reply("I can't play that for some reason. Most likely it's got a copyright on it. Try a different video!");
            return;
        }
        else if (song == null) {
            console.log("[TEMP-CHA] Caught an error at invalid song.");
            msg.reply("I can't play that for some reason. Most likely it's got a copyright on it. Try a different video!");
            return;
        }
        else {
            if (!fishsticks.playlist) {
                const queueConstruct = {
                    txtCh: msg.channel,
                    vCh: memberVC,
                    connection: null,
                    songs: [],
                    volume: 5,
                    playing: true
                };
    
                fishsticks.queue.set(msg.guild.id, queueConstruct);
    
                queueConstruct.songs.push(song);
    
                try {
                    var connection = await memberVC.join();
                    fishsticks.vc = memberVC;
    
                    queueConstruct.connection = connection;
                    play(msg.guild, queueConstruct.songs[0]);
        
                    console.log("[MUSI-SYS] Attached to channel and playing song...");

                    fishsticks.playrejects = 0;
                }
                catch (error) {
                    console.error(`[MUSI-SYS] Connection to channel refused: ${error}`);
    
                    fishsticks.queue.delete(msg.guild.id);
    
                    return logger.send("I failed to connect to a channel, check the log! " + ranger);
                }
            }
            else {
                fishsticks.playlist.songs.push(song);
                logger.send(`The song **${song.title}** has been added to the play queue.`);
            }
        }
    }

    function play(guild, song) {

        fishsticks.serverQueue = fishsticks.queue.get(guild.id);

        if (!song) {
            fishsticks.serverQueue.vCh.leave();
            fishsticks.queue.delete(guild.id);
            return;
        }

        const dispatch = fishsticks.serverQueue.connection.playStream(ytdl(song.url))
            .on('end', () => {
                console.log("[MUSI-SYS] Song ended.");
                fishsticks.serverQueue.songs.shift();
                play(guild, fishsticks.serverQueue.songs[0]);
            })
            .on('error', error => console.error("[MUSI-SYS] Error Report: " + error));
        
        dispatch.setVolumeLogarithmic(fishsticks.serverQueue.volume / 5);

        logger.send(`**Now playing**: ${song.title}`);
    }

    //COMMAND CONDITIONS (CHECKS BEFORE EXECUTING FUNCTIONS)
    if (!cmd[0].includes("youtube.com")) {
        msg.reply("That's not a proper YouTube link! (Make sure it's a `.com` and not a `.be`)");
        console.log("[MUSI-SYS] Improper YouTube link.");
    }
    else {
        if (msg.member.roles.find('name', 'Bot') || msg.member.roles.find("name", "Staff")) {
            logger.send("Command permissions authorized and granted to " + msg.author.tag + ".");
            console.log("[MUSI-SYS] Staff override acknowledged.")
            accept();
        }
        else if ((msg.member.roles.find('name', 'CC Member')) || (msg.member.roles.find('name', 'ACC Member'))) { //If member
            if (engmode == true) { //If ENGM is on
                console.log("[MUSI-SYS] Play command ignored via ENGM being true.")
    
                msg.reply("I can't play music while Engineering Mode is enabled! Ask " + ranger + " to clarify.");
            }
            else { //If ENGM is not on
                if (!memberVC) {
                    msg.reply("You're not attached to a voice channel silly; you can't play music if you can't hear it. :thonk:");
                }
                else if (memberVC == hangoutVC) {
                    msg.reply("No no, get out of the Hangout channel. You can't play music in there.");
                }
                else if (memberVC == channelSpawner) {
                    msg.reply("The channel spawner channel is not meant for music! Spawn one and then use the play system.");
                }
                else {
                    for (var t = 0; t < fishsticks.tempChannels.length; t++) {
                        if (memberVC == (fishsticks.channels.get(fishsticks.tempChannels[t]))) {
                            accept();
                        }
                    }
                }
            }
        }
        else {
            msg.reply("You lack the necessary permissions to use the music player. You must be a member!").then(sent => sent.delete(10000));
        }
    }
}