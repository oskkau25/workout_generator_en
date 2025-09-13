/**
 * Exercise Database Module
 * Contains all exercise definitions with enhanced metadata for smart substitution
 * 
 * Features:
 * - Detailed exercise descriptions with safety guidelines
 * - Equipment requirements and alternatives
 * - Difficulty levels and muscle group targeting
 * - Injury safety considerations
 * - Smart substitution metadata
 */

// Export the exercises array for use in other modules
export const exercises = [
    // Warm-up exercises
    { 
        name: "Leg Swings", 
        description: "Hold onto a wall or sturdy surface for balance. Swing one leg forward and back in a controlled motion, keeping the movement smooth. Do 10-15 swings per leg, then switch. ⚠️ DO: Keep upper body stable, swing from hip joint. DON'T: Swing too fast or let momentum take over. Stop if you feel hip or knee pain.", 
        equipment: "Bodyweight", 
        level: "Beginner", 
        muscle: "Legs", 
        type: "warmup",
        // Enhanced exercise information
        resources: {
            googleSearch: "leg swings warm up exercise proper form technique",
            youtubeSearch: "leg swings dynamic warm up exercise tutorial",
            modifications: {
                beginner: "Hold onto wall for support, small swings",
                intermediate: "Standard leg swings with minimal support",
                advanced: "Larger range of motion, no support needed"
            },
            timing: {
                warmup: "30-60 seconds per leg",
                main: "Not recommended for main workout"
            },
            progression: ["Small swings → Large swings → No support → Multi-directional"]
        },
        alternatives: ["Hip Circles", "Ankle Rotations", "Marching in Place"],
        difficulty: 1,
        equipment_needed: ["none"],
        muscle_groups: ["quadriceps", "hamstrings", "glutes"],
        injury_safe: ["knee_pain", "hip_pain"]
    },
    { 
        name: "Jumping Jacks", 
        description: "Start standing with feet together and arms at sides. Jump feet apart while raising arms overhead, then jump back to starting position. Land softly on balls of feet. ⚠️ DO: Land softly, keep core engaged, breathe rhythmically. DON'T: Land hard on heels, hold breath, or jump too high if you have joint issues.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "warmup",
        // Enhanced exercise information
        resources: {
            googleSearch: "jumping jacks exercise proper form technique",
            youtubeSearch: "jumping jacks warm up exercise tutorial",
            modifications: {
                beginner: "Step jacks (no jumping) or half jacks",
                intermediate: "Standard jumping jacks",
                advanced: "Add arm variations or increase speed"
            },
            timing: {
                warmup: "30-60 seconds",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Step jacks → Half jacks → Full jumping jacks → Speed variations"]
        }
    },
    { 
        name: "Jumping Rope (slow)", 
        description: "Hold rope handles at hip level. Jump just high enough to clear the rope, keeping jumps small and controlled. Land softly on balls of feet. ⚠️ DO: Keep jumps small, maintain rhythm, land softly. DON'T: Jump too high, let rope hit feet repeatedly, or continue if you feel ankle pain.", 
        equipment: "Jump Rope", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "warmup",
        // Enhanced exercise information
        resources: {
            googleSearch: "jumping rope (slow) exercise proper form technique",
            youtubeSearch: "jumping rope (slow) warmup exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard jumping rope (slow)",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "30-60 seconds",
                main: "Not recommended for main workout"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Torso Twists", 
        description: "Stand with feet shoulder-width apart, arms extended at shoulder height. Rotate upper body from side to side, keeping hips facing forward. Move slowly and controlled. ⚠️ DO: Keep hips stable, rotate from waist, breathe normally. DON'T: Twist too fast, let hips rotate, or force range of motion.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Core", 
        type: "warmup",
        // Enhanced exercise information
        resources: {
            googleSearch: "torso twists exercise proper form technique",
            youtubeSearch: "torso twists warmup exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard torso twists",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "30-60 seconds",
                main: "Not recommended for main workout"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "High Knees", 
        description: "Run in place, bringing knees up toward chest level. Pump arms naturally and stay on balls of feet. Keep torso upright and core engaged. ⚠️ DO: Keep good posture, engage core, land softly. DON'T: Lean back, let knees go too high if you have hip issues, or hold breath.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "warmup",
        // Enhanced exercise information
        resources: {
            googleSearch: "high knees exercise proper form technique",
            youtubeSearch: "high knees warmup exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard high knees",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "30-60 seconds",
                main: "Not recommended for main workout"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Butt Kicks", 
        description: "Run in place, kicking heels back toward glutes. Keep torso upright and pump arms naturally. Stay on balls of feet throughout movement. ⚠️ DO: Keep good posture, kick heels back naturally, maintain rhythm. DON'T: Lean forward, kick too hard, or let feet slap down.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "warmup",
        // Enhanced exercise information
        resources: {
            googleSearch: "butt kicks exercise proper form technique",
            youtubeSearch: "butt kicks warmup exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard butt kicks",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "30-60 seconds",
                main: "Not recommended for main workout"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Cat-Cow Stretch", 
        description: "Start on hands and knees. Inhale, drop belly and lift head (cow). Exhale, round back and tuck chin (cat). Move slowly with breath. ⚠️ DO: Move with breath, keep movements controlled, feel spine mobility. DON'T: Force range of motion, move too fast, or continue if you feel back pain.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "warmup",
        // Enhanced exercise information
        resources: {
            googleSearch: "cat-cow stretch exercise proper form technique",
            youtubeSearch: "cat-cow stretch warmup exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard cat-cow stretch",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "30-60 seconds",
                main: "Not recommended for main workout"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Hip Circles", 
        description: "Stand on one leg, holding onto support if needed. Make large circles with opposite knee, moving slowly and controlled. Do 5-8 circles each direction. ⚠️ DO: Keep standing leg stable, move slowly, hold support if needed. DON'T: Rush the movement, lose balance, or continue if you feel hip pain.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "warmup",
        // Enhanced exercise information
        resources: {
            googleSearch: "hip circles exercise proper form technique",
            youtubeSearch: "hip circles warmup exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard hip circles",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "30-60 seconds",
                main: "Not recommended for main workout"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Ankle Rotations", 
        description: "Sit or stand and lift one foot off ground. Rotate ankle in circles, first clockwise then counter-clockwise. Do 10 rotations each direction per foot. ⚠️ DO: Move slowly, feel ankle mobility, keep movements controlled. DON'T: Force range of motion, move too fast, or continue if you feel ankle pain.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "warmup",
        // Enhanced exercise information
        resources: {
            googleSearch: "ankle rotations warm up exercise proper form",
            youtubeSearch: "ankle rotations warm up exercise tutorial",
            modifications: {
                beginner: "Small circles, hold onto wall for support",
                intermediate: "Standard ankle rotations",
                advanced: "Large circles, no support needed"
            },
            timing: {
                warmup: "30-60 seconds per ankle",
                main: "Not recommended for main workout"
            },
            progression: ["Small circles → Large circles → Multi-directional"]
        } 
    },
    { 
        name: "Inchworm", 
        description: "Stand with feet together. Bend forward and walk hands out to plank position. Hold plank briefly, then walk feet toward hands, keeping legs straight. ⚠️ DO: Keep core engaged, move slowly, maintain plank form. DON'T: Let hips sag in plank, rush the movement, or round back excessively.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "warmup",
        // Enhanced exercise information
        resources: {
            googleSearch: "inchworm exercise proper form technique warm up",
            youtubeSearch: "inchworm warm up exercise tutorial",
            modifications: {
                beginner: "Bend knees slightly, shorter range",
                intermediate: "Standard inchworm with straight legs",
                advanced: "Add push-up at plank position"
            },
            timing: {
                warmup: "30-60 seconds",
                main: "Not recommended for main workout"
            },
            progression: ["Bent knees → Straight legs → With push-up → Single-leg inchworm"]
        } 
    },
    { 
        name: "World's Greatest Stretch", 
        description: "Step into deep lunge, place both hands on floor inside front foot. Twist torso and reach one arm to sky, looking up. Hold 2-3 seconds, then switch sides. ⚠️ DO: Keep back knee off ground, twist from torso, breathe deeply. DON'T: Force the stretch, let back knee touch ground, or twist too aggressively.", 
        equipment: "Bodyweight", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "warmup",
        // Enhanced exercise information
        resources: {
            googleSearch: "world's greatest stretch exercise proper form technique",
            youtubeSearch: "world's greatest stretch warmup exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard world's greatest stretch",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "30-60 seconds",
                main: "Not recommended for main workout"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Light Rowing", 
        description: "Sit on rower with feet secured. Start with easy pace, focusing on proper form: push with legs, then pull with arms. Keep back straight throughout. ⚠️ DO: Maintain good posture, use full range of motion, breathe rhythmically. DON'T: Round back, pull too hard, or ignore proper form for speed.", 
        equipment: "Rower", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "warmup",
        // Enhanced exercise information
        resources: {
            googleSearch: "light rowing exercise proper form technique",
            youtubeSearch: "light rowing warmup exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard light rowing",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "30-60 seconds",
                main: "Not recommended for main workout"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Dynamic Chest Stretch", 
        description: "Stand with arms extended at shoulder height. Swing arms back to open chest, then cross arms in front. Move slowly and feel chest stretch. ⚠️ DO: Move slowly, feel chest opening, keep shoulders relaxed. DON'T: Force the stretch, move too fast, or continue if you feel shoulder pain.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Chest", 
        type: "warmup",
        // Enhanced exercise information
        resources: {
            googleSearch: "dynamic chest stretch exercise proper form technique",
            youtubeSearch: "dynamic chest stretch warmup exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard dynamic chest stretch",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "30-60 seconds",
                main: "Not recommended for main workout"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Side Lunges", 
        description: "Stand with feet wide apart. Step to one side, bending knee and keeping other leg straight. Push back to center and repeat on other side. ⚠️ DO: Keep chest up, push through heel, maintain balance. DON'T: Let knee cave inward, round back, or lose balance.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "warmup",
        // Enhanced exercise information
        resources: {
            googleSearch: "side lunges exercise proper form technique",
            youtubeSearch: "side lunges warmup exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard side lunges",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "30-60 seconds",
                main: "Not recommended for main workout"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Frankenstein Kicks", 
        description: "Walk forward, kicking one leg straight out in front, trying to touch opposite hand to toe. Keep standing leg straight and maintain balance. ⚠️ DO: Keep good posture, kick leg straight, maintain balance. DON'T: Round back, kick too high if you have hamstring issues, or rush the movement.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "warmup",
        // Enhanced exercise information
        resources: {
            googleSearch: "frankenstein kicks exercise proper form technique",
            youtubeSearch: "frankenstein kicks warmup exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard frankenstein kicks",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "30-60 seconds",
                main: "Not recommended for main workout"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Glute Bridges (Warm-up)", 
        description: "Lie on back with knees bent, feet flat on floor. Lift hips toward ceiling, squeezing glutes. Hold briefly, then lower with control. ⚠️ DO: Squeeze glutes, keep core engaged, lower slowly. DON'T: Arch back excessively, lift hips too high, or let knees cave inward.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "warmup",
        // Enhanced exercise information
        resources: {
            googleSearch: "glute bridges (warm-up) exercise proper form technique",
            youtubeSearch: "glute bridges (warm-up) warmup exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard glute bridges (warm-up)",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "30-60 seconds",
                main: "Not recommended for main workout"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Shoulder Taps", 
        description: "Start in plank position on hands. Slowly tap left shoulder with right hand, then right shoulder with left hand. Keep hips stable throughout. ⚠️ DO: Keep hips level, move slowly, maintain plank form. DON'T: Let hips rotate, move too fast, or let body sag.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Core", 
        type: "warmup",
        // Enhanced exercise information
        resources: {
            googleSearch: "shoulder taps exercise proper form technique",
            youtubeSearch: "shoulder taps warmup exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard shoulder taps",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "30-60 seconds",
                main: "Not recommended for main workout"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Wrist Circles", 
        description: "Extend arms in front, make fists, and rotate wrists in circles. Do 10 circles clockwise, then 10 counter-clockwise. ⚠️ DO: Move slowly, feel wrist mobility, keep movements controlled. DON'T: Force range of motion, move too fast, or continue if you feel wrist pain.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Arms", 
        type: "warmup",
        // Enhanced exercise information
        resources: {
            googleSearch: "wrist circles warm up exercise proper form",
            youtubeSearch: "wrist circles warm up exercise tutorial",
            modifications: {
                beginner: "Small circles, arms at sides",
                intermediate: "Standard wrist circles",
                advanced: "Large circles, arms extended"
            },
            timing: {
                warmup: "30-60 seconds",
                main: "Not recommended for main workout"
            },
            progression: ["Small circles → Large circles → Extended arms → Multi-directional"]
        } 
    },
    { 
        name: "Neck Rolls", 
        description: "Stand or sit with good posture. Slowly tilt head to one side, then roll forward and to other side. Avoid full circles - go side to side only. ⚠️ DO: Move very slowly, keep movements small, stop if uncomfortable. DON'T: Do full circles, move too fast, or continue if you feel neck pain.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "warmup",
        // Enhanced exercise information
        resources: {
            googleSearch: "neck rolls exercise proper form technique",
            youtubeSearch: "neck rolls warmup exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard neck rolls",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "30-60 seconds",
                main: "Not recommended for main workout"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },

    // Main exercises - Bodyweight
    { 
        name: "Squats", 
        description: "Stand with feet shoulder-width apart, toes slightly out. Push hips back and lower as if sitting in chair. Keep chest up, knees over toes. Push through heels to stand. ⚠️ DO: Keep chest up, push knees out, go to parallel or higher. DON'T: Let knees cave inward, round back, or go too deep if you have knee issues.", 
        equipment: "Bodyweight", 
        level: "Intermediate", 
        muscle: "Legs", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "squats exercise proper form technique legs",
            youtubeSearch: "squats correct form tutorial beginner",
            modifications: {
                beginner: "Chair-assisted squats or wall squats",
                intermediate: "Standard bodyweight squats",
                advanced: "Jump squats, single-leg squats, or weighted squats"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Chair squats → Bodyweight squats → Jump squats → Single-leg squats"]
        },
        alternatives: ["Wall Sits", "Chair Squats", "Glute Bridges"],
        difficulty: 2,
        equipment_needed: ["none"],
        muscle_groups: ["quadriceps", "glutes", "hamstrings"],
        injury_safe: ["knee_pain", "back_pain"]
    },
    { 
        name: "Push-ups", 
        description: "Start in plank position, hands slightly wider than shoulders. Lower chest toward floor, keeping body straight. Push back up to start. Beginners: keep knees on ground. ⚠️ DO: Keep body straight, lower chest not head, breathe rhythmically. DON'T: Let hips sag, touch floor with face, or hold breath.", 
        equipment: "Bodyweight", 
        level: "Intermediate", 
        muscle: "Chest", 
        type: "main",
        alternatives: ["Wall Push-ups", "Knee Push-ups", "Incline Push-ups"],
        difficulty: 2,
        equipment_needed: ["none"],
        muscle_groups: ["chest", "triceps", "shoulders"],
        injury_safe: ["shoulder_pain", "wrist_pain"],
        // Enhanced exercise information
        resources: {
            googleSearch: "push ups proper form technique chest exercise",
            youtubeSearch: "push ups correct form tutorial beginner",
            modifications: {
                beginner: "Knee push-ups or wall push-ups",
                intermediate: "Standard push-ups on floor",
                advanced: "Diamond push-ups, decline push-ups, or one-arm variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Wall push-ups → Knee push-ups → Standard push-ups → Diamond push-ups"]
        }
    },
    { 
        name: "Lunges", 
        description: "Step forward with one leg, lowering until both knees are bent at 90 degrees. Front knee should be over toes, back knee near ground. Push back to start and switch legs. ⚠️ DO: Keep chest up, front knee over toes, back knee near ground. DON'T: Let front knee go past toes, round back, or lose balance.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate"], 
        muscle: "Legs", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "lunges exercise proper form technique legs",
            youtubeSearch: "lunges correct form tutorial beginner",
            modifications: {
                beginner: "Static lunges or reverse lunges with support",
                intermediate: "Walking lunges or alternating lunges",
                advanced: "Jumping lunges or weighted lunges"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Static lunges → Walking lunges → Jumping lunges → Weighted lunges"]
        }
    },
    { 
        name: "Plank", 
        description: "Start in push-up position, then lower to forearms. Keep body in straight line from head to heels. Engage core and hold position. ⚠️ DO: Keep body straight, engage core, breathe normally. DON'T: Let hips sag or lift, hold breath, or let head drop.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Core", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "plank exercise proper form technique core",
            youtubeSearch: "plank correct form tutorial beginner",
            modifications: {
                beginner: "Knee plank or wall plank",
                intermediate: "Standard forearm plank",
                advanced: "Single-arm plank, side plank, or plank variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "30-60 seconds hold, 15-30 seconds rest"
            },
            progression: ["Knee plank → Forearm plank → Single-arm plank → Side plank"]
        } 
    },
    { 
        name: "Glute Bridge", 
        description: "Lie on back with knees bent, feet flat on floor. Lift hips toward ceiling, squeezing glutes. Hold briefly at top, then lower with control. ⚠️ DO: Squeeze glutes, keep core engaged, lift hips high enough. DON'T: Arch back excessively, let knees cave inward, or lift hips too high.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "glute bridge exercise proper form technique",
            youtubeSearch: "glute bridge main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard glute bridge",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Wall Sit", 
        description: "Lean against wall, slide down until thighs are parallel to floor. Keep back against wall, feet shoulder-width apart. Hold position. ⚠️ DO: Keep back against wall, thighs parallel to floor, breathe normally. DON'T: Let knees go past toes, slide too low, or hold breath.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate"], 
        muscle: "Legs", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "wall sit exercise proper form technique",
            youtubeSearch: "wall sit main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard wall sit",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Step-ups", 
        description: "Stand facing sturdy step or bench. Step up with one foot, then bring other foot up. Step back down with control and repeat. ⚠️ DO: Use full foot on step, keep chest up, step down with control. DON'T: Use momentum, let knee cave inward, or step down too hard.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate"], 
        muscle: "Legs", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "step-ups exercise proper form technique",
            youtubeSearch: "step-ups main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard step-ups",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Calf Raises", 
        description: "Stand on edge of step with heels hanging off. Rise up onto balls of feet, then lower heels below step level. Keep knees straight throughout. ⚠️ DO: Use full range of motion, keep knees straight, control the movement. DON'T: Bounce at bottom, let heels hit ground hard, or use momentum.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "calf raises exercise proper form technique",
            youtubeSearch: "calf raises main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard calf raises",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Bird Dog", 
        description: "Start on hands and knees. Extend right arm forward and left leg back, keeping both straight. Hold briefly, then switch sides. Keep core engaged throughout. ⚠️ DO: Keep core stable, extend arm and leg straight, maintain balance. DON'T: Let hips rotate, lift too high, or lose balance.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate"], 
        muscle: "Core", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "bird dog exercise proper form technique",
            youtubeSearch: "bird dog main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard bird dog",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Dead Bug", 
        description: "Lie on back with arms extended toward ceiling, knees bent at 90 degrees. Lower opposite arm and leg toward floor, keeping back flat. Return and switch sides. ⚠️ DO: Keep back flat on floor, move slowly, engage core. DON'T: Let back arch, move too fast, or let legs drop too low.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate"], 
        muscle: "Core", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "dead bug exercise proper form technique",
            youtubeSearch: "dead bug main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard dead bug",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Burpees", 
        description: "Start standing, drop into squat, place hands on floor, jump feet back to plank, do push-up, jump feet forward, then jump up with arms overhead. ⚠️ DO: Land softly, maintain good form throughout, breathe rhythmically. DON'T: Rush the movement, sacrifice form for speed, or land hard on feet.", 
        equipment: "Bodyweight", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "burpees exercise proper form technique full body",
            youtubeSearch: "burpees correct form tutorial beginner",
            modifications: {
                beginner: "Step-back burpees or no-push-up burpees",
                intermediate: "Standard burpees with push-up",
                advanced: "Burpee variations with tuck jumps or single-leg burpees"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "30-45 seconds work, 15-30 seconds rest"
            },
            progression: ["Step burpees → Standard burpees → Burpee variations → Single-leg burpees"]
        } 
    },
    { 
        name: "Diamond Push-ups", 
        description: "Form diamond shape with hands under chest, thumbs and index fingers touching. Perform push-up, keeping elbows close to body. Focuses on triceps. ⚠️ DO: Keep elbows close to body, lower chest to hands, maintain straight body. DON'T: Let elbows flare out, touch face to ground, or let hips sag.", 
        equipment: "Bodyweight", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Arms", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "diamond push-ups exercise proper form technique",
            youtubeSearch: "diamond push-ups main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard diamond push-ups",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Pike Push-ups", 
        description: "Start in downward dog position, hands and feet on ground, hips high. Lower head toward ground, then push back up. Focuses on shoulders. ⚠️ DO: Keep hips high, lower head not chest, maintain straight arms. DON'T: Let hips drop, round back, or touch head to ground too hard.", 
        equipment: "Bodyweight", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Shoulders", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "pike push-ups exercise proper form technique",
            youtubeSearch: "pike push-ups main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard pike push-ups",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Superman", 
        description: "Lie face down on floor. Lift chest, arms, and legs off ground simultaneously. Hold briefly, then lower with control. Strengthens lower back. ⚠️ DO: Lift chest and legs together, keep neck neutral, breathe normally. DON'T: Lift too high, strain neck, or hold breath.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate"], 
        muscle: "Back", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "superman exercise proper form technique",
            youtubeSearch: "superman main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard superman",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Russian Twists", 
        description: "Sit on floor, lean back slightly, lift feet off ground. Twist torso from side to side, touching hands to floor on each side. Keep feet elevated. ⚠️ DO: Keep feet off ground, twist from torso, maintain balance. DON'T: Let feet touch ground, twist too fast, or round back excessively.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Core", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "russian twists exercise proper form technique",
            youtubeSearch: "russian twists main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard russian twists",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Bicycle Crunches", 
        description: "Lie on back, lift shoulders off ground. Bring opposite knee to opposite elbow in cycling motion. Keep lower back pressed to floor. ⚠️ DO: Keep lower back on floor, move slowly, engage core. DON'T: Pull on neck, let lower back lift, or move too fast.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Core", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "bicycle crunches exercise proper form technique",
            youtubeSearch: "bicycle crunches main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard bicycle crunches",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Mountain Climbers", 
        description: "Start in plank position. Alternate bringing knees toward chest as if climbing. Keep hips level and core engaged throughout. ⚠️ DO: Keep hips level, move knees toward chest, maintain plank form. DON'T: Let hips lift, move too fast, or sacrifice form for speed.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "mountain climbers exercise proper form technique cardio",
            youtubeSearch: "mountain climbers correct form tutorial beginner",
            modifications: {
                beginner: "Slow mountain climbers or knee-to-chest in plank",
                intermediate: "Standard mountain climbers",
                advanced: "Fast mountain climbers or cross-body mountain climbers"
            },
            timing: {
                warmup: "30-45 seconds",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Slow climbers → Standard climbers → Fast climbers → Cross-body climbers"]
        } 
    },
    { 
        name: "Jump Squats", 
        description: "Perform regular squat, then explosively jump up, landing softly back in squat position. Land on balls of feet with knees slightly bent. ⚠️ DO: Land softly, maintain squat form, use arms for momentum. DON'T: Land hard on heels, let knees cave inward, or jump too high if you have joint issues.", 
        equipment: "Bodyweight", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "jump squats exercise proper form technique",
            youtubeSearch: "jump squats main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard jump squats",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Split Squats", 
        description: "Step one foot back into lunge position. Lower body until back knee nearly touches ground. Keep front knee over toes. Push back up and repeat. ⚠️ DO: Keep front knee over toes, back knee near ground, chest up. DON'T: Let front knee go past toes, round back, or lose balance.", 
        equipment: "Bodyweight", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "split squats exercise proper form technique",
            youtubeSearch: "split squats main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard split squats",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Single-leg Glute Bridge", 
        description: "Lie on back with knees bent. Extend one leg straight up. Lift hips using only the bent leg, squeezing glutes. Lower with control and repeat. ⚠️ DO: Keep extended leg straight, squeeze glutes, maintain hip level. DON'T: Let hips tilt, let extended leg drop, or arch back excessively.", 
        equipment: "Bodyweight", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "single-leg glute bridge exercise proper form technique",
            youtubeSearch: "single-leg glute bridge main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard single-leg glute bridge",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },

    // Main exercises - Dumbbells
    { 
        name: "Dumbbell Bicep Curls", 
        description: "Stand with dumbbells at sides, palms facing forward. Curl dumbbells toward shoulders, keeping elbows at sides. Lower with control and repeat. ⚠️ DO: Keep elbows at sides, control the movement, squeeze biceps. DON'T: Swing body, let elbows move forward, or use momentum.", 
        equipment: "Dumbbells", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Arms", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "dumbbell bicep curls exercise proper form technique",
            youtubeSearch: "dumbbell bicep curls main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard dumbbell bicep curls",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Dumbbell Shoulder Press", 
        description: "Sit or stand with dumbbells at shoulder height, palms facing forward. Press dumbbells overhead until arms are straight. Lower with control and repeat. ⚠️ DO: Keep core engaged, press straight up, control the movement. DON'T: Arch back, let elbows flare out, or use momentum.", 
        equipment: "Dumbbells", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Shoulders", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "dumbbell shoulder press exercise proper form technique",
            youtubeSearch: "dumbbell shoulder press main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard dumbbell shoulder press",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Bent-over Dumbbell Rows", 
        description: "Bend forward at hips, keeping back straight. Hold dumbbells with arms hanging down. Pull dumbbells toward chest, squeezing shoulder blades. Lower with control. ⚠️ DO: Keep back straight, pull elbows back, squeeze shoulder blades. DON'T: Round back, use momentum, or let shoulders shrug.", 
        equipment: "Dumbbells", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "bent-over dumbbell rows exercise proper form technique",
            youtubeSearch: "bent-over dumbbell rows main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard bent-over dumbbell rows",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Goblet Squat", 
        description: "Hold dumbbell vertically at chest level. Perform squat, keeping dumbbell close to chest. Go as deep as comfortable while maintaining good form. ⚠️ DO: Keep dumbbell close to chest, maintain upright posture, go to comfortable depth. DON'T: Let knees cave inward, round back, or let dumbbell move away from body.", 
        equipment: "Dumbbells", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "goblet squat exercise proper form technique",
            youtubeSearch: "goblet squat main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard goblet squat",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Dumbbell Flys", 
        description: "Lie on back with dumbbells extended above chest. Lower dumbbells out to sides in wide arc, keeping slight bend in elbows. Return to start and repeat. ⚠️ DO: Keep slight bend in elbows, control the movement, feel chest stretch. DON'T: Lock elbows, let dumbbells drop too low, or use momentum.", 
        equipment: "Dumbbells", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Chest", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "dumbbell flys exercise proper form technique",
            youtubeSearch: "dumbbell flys main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard dumbbell flys",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Tricep Kickbacks", 
        description: "Bend forward at hips, keeping back straight. Hold dumbbell with elbow bent at 90 degrees. Extend arm straight back, squeezing tricep. Return and repeat. ⚠️ DO: Keep upper arm still, extend arm straight back, squeeze tricep. DON'T: Move upper arm, use momentum, or round back.", 
        equipment: "Dumbbells", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Arms", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "tricep kickbacks exercise proper form technique",
            youtubeSearch: "tricep kickbacks main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard tricep kickbacks",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Overhead Tricep Extension", 
        description: "Hold one dumbbell with both hands above head. Lower dumbbell behind head by bending elbows. Extend arms back to start and repeat. ⚠️ DO: Keep elbows close to head, control the movement, feel tricep work. DON'T: Let elbows flare out, arch back, or use momentum.", 
        equipment: "Dumbbells", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Arms", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "overhead tricep extension exercise proper form technique",
            youtubeSearch: "overhead tricep extension main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard overhead tricep extension",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Dumbbell Lunges", 
        description: "Hold dumbbells at sides. Step forward into lunge, lowering until both knees are bent at 90 degrees. Push back to start and repeat with other leg. ⚠️ DO: Keep chest up, front knee over toes, control the movement. DON'T: Let front knee go past toes, round back, or use momentum.", 
        equipment: "Dumbbells", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "dumbbell lunges exercise proper form technique",
            youtubeSearch: "dumbbell lunges main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard dumbbell lunges",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Romanian Deadlifts (RDLs)", 
        description: "Hold dumbbells in front of thighs. Hinge at hips, pushing butt back while lowering dumbbells down legs. Keep back straight and legs nearly straight. ⚠️ DO: Hinge at hips, keep back straight, feel hamstring stretch. DON'T: Round back, bend knees too much, or let dumbbells swing.", 
        equipment: "Dumbbells", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "romanian deadlifts (rdls) exercise proper form technique",
            youtubeSearch: "romanian deadlifts (rdls) main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard romanian deadlifts (rdls)",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Lateral Raises", 
        description: "Stand with dumbbells at sides, palms facing body. Raise arms out to sides until they're at shoulder level. Lower with control and repeat. ⚠️ DO: Keep slight bend in elbows, raise to shoulder level, control the movement. DON'T: Raise above shoulder level, use momentum, or shrug shoulders.", 
        equipment: "Dumbbells", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Shoulders", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "lateral raises exercise proper form technique",
            youtubeSearch: "lateral raises main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard lateral raises",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Front Raises", 
        description: "Stand with dumbbells in front of thighs, palms facing body. Raise dumbbells straight out in front to shoulder level. Lower with control and repeat. ⚠️ DO: Keep slight bend in elbows, raise to shoulder level, control the movement. DON'T: Raise above shoulder level, use momentum, or arch back.", 
        equipment: "Dumbbells", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Shoulders", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "front raises exercise proper form technique",
            youtubeSearch: "front raises main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard front raises",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Dumbbell Deadlift", 
        description: "Stand with dumbbells in front of thighs. Hinge at hips, lowering dumbbells down legs while keeping back straight. Return to start by pushing hips forward. ⚠️ DO: Hinge at hips, keep back straight, control the movement. DON'T: Round back, bend knees too much, or use momentum.", 
        equipment: "Dumbbells", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "dumbbell deadlift exercise proper form technique",
            youtubeSearch: "dumbbell deadlift main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard dumbbell deadlift",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Dumbbell Chest Press", 
        description: "Lie on back with dumbbells at chest level, palms facing forward. Press dumbbells straight up until arms are extended. Lower with control and repeat. ⚠️ DO: Keep core engaged, press straight up, control the movement. DON'T: Arch back, let elbows flare out, or use momentum.", 
        equipment: "Dumbbells", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Chest", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "dumbbell chest press exercise proper form technique",
            youtubeSearch: "dumbbell chest press main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard dumbbell chest press",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },

    // Cool-down exercises
    { 
        name: "Quad Stretch", 
        description: "Stand upright, bend one knee and grab foot behind you. Pull foot toward glutes, keeping knee pointing down. Hold 30 seconds per side. ⚠️ DO: Keep knee pointing down, hold stretch gently, breathe normally. DON'T: Force the stretch, let knee point outward, or hold breath.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "cooldown",
        // Enhanced exercise information
        resources: {
            googleSearch: "quad stretch exercise proper form technique",
            youtubeSearch: "quad stretch cooldown exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard quad stretch",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Chest Stretch", 
        description: "Stand in doorway, place forearms against door frame. Step forward to feel chest stretch. Hold 30 seconds, breathing deeply. ⚠️ DO: Keep shoulders relaxed, breathe deeply, feel gentle stretch. DON'T: Force the stretch, hold breath, or continue if you feel shoulder pain.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Chest", 
        type: "cooldown",
        // Enhanced exercise information
        resources: {
            googleSearch: "chest stretch exercise proper form technique",
            youtubeSearch: "chest stretch cooldown exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard chest stretch",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Child's Pose", 
        description: "Kneel on floor, sit back on heels, bend forward until forehead touches floor. Extend arms forward or rest them at sides. Hold 30-60 seconds. ⚠️ DO: Relax into the stretch, breathe deeply, let back round naturally. DON'T: Force the stretch, hold breath, or continue if you feel knee pain.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "cooldown",
        // Enhanced exercise information
        resources: {
            googleSearch: "child's pose exercise proper form technique",
            youtubeSearch: "child's pose cooldown exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard child's pose",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Hamstring Stretch", 
        description: "Sit on floor with one leg extended, other leg bent. Lean forward from hips toward extended foot. Hold 30 seconds per side. ⚠️ DO: Lean from hips, keep back straight, feel gentle stretch. DON'T: Round back, force the stretch, or continue if you feel sharp pain.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "cooldown",
        // Enhanced exercise information
        resources: {
            googleSearch: "hamstring stretch exercise proper form technique",
            youtubeSearch: "hamstring stretch cooldown exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard hamstring stretch",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Pigeon Pose", 
        description: "Start on hands and knees. Bring one knee forward and place it behind wrist, extending other leg back. Lower hips toward floor and hold 30 seconds per side. ⚠️ DO: Keep hips square, breathe deeply, feel gentle stretch. DON'T: Force the stretch, let hips tilt, or continue if you feel knee pain.", 
        equipment: "Bodyweight", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "cooldown",
        // Enhanced exercise information
        resources: {
            googleSearch: "pigeon pose exercise proper form technique",
            youtubeSearch: "pigeon pose cooldown exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard pigeon pose",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Triceps Stretch", 
        description: "Reach one arm overhead, bend elbow and place hand behind head. Use other hand to gently pull elbow toward head. Hold 30 seconds per side. ⚠️ DO: Pull gently, keep shoulders relaxed, breathe normally. DON'T: Pull too hard, hold breath, or continue if you feel shoulder pain.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Arms", 
        type: "cooldown",
        // Enhanced exercise information
        resources: {
            googleSearch: "triceps stretch exercise proper form technique",
            youtubeSearch: "triceps stretch cooldown exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard triceps stretch",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Shoulder Stretch", 
        description: "Bring one arm across chest at shoulder level. Use other arm to gently pull it closer to chest. Hold 30 seconds per side. ⚠️ DO: Pull gently, keep shoulders relaxed, breathe normally. DON'T: Pull too hard, round back, or continue if you feel shoulder pain.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Shoulders", 
        type: "cooldown",
        // Enhanced exercise information
        resources: {
            googleSearch: "shoulder stretch exercise proper form technique",
            youtubeSearch: "shoulder stretch cooldown exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard shoulder stretch",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Calf Stretch", 
        description: "Stand facing wall, step one foot back. Press heel into floor while keeping back leg straight. Hold 30 seconds per side. ⚠️ DO: Keep back leg straight, press heel down, feel gentle stretch. DON'T: Bounce, force the stretch, or continue if you feel ankle pain.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "cooldown",
        // Enhanced exercise information
        resources: {
            googleSearch: "calf stretch exercise proper form technique",
            youtubeSearch: "calf stretch cooldown exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard calf stretch",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Hip Flexor Stretch", 
        description: "Kneel in lunge position, one foot forward. Gently push hips forward while keeping back straight. Hold 30 seconds per side. ⚠️ DO: Keep back straight, push hips gently forward, breathe deeply. DON'T: Arch back, force the stretch, or continue if you feel hip pain.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "cooldown",
        // Enhanced exercise information
        resources: {
            googleSearch: "hip flexor stretch exercise proper form technique",
            youtubeSearch: "hip flexor stretch cooldown exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard hip flexor stretch",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Knees to Chest", 
        description: "Lie on back, hug both knees to chest. Rock gently side to side if comfortable. Hold 30-60 seconds, breathing deeply. ⚠️ DO: Hug knees gently, breathe deeply, relax into stretch. DON'T: Force knees too close, hold breath, or continue if you feel back pain.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "cooldown",
        // Enhanced exercise information
        resources: {
            googleSearch: "knees to chest exercise proper form technique",
            youtubeSearch: "knees to chest cooldown exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard knees to chest",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Cobra Pose", 
        description: "Lie face down, place hands under shoulders. Gently push upper body up, arching back slightly. Keep hips on floor and hold 15-30 seconds. ⚠️ DO: Push up gently, keep hips on floor, breathe normally. DON'T: Push up too high, strain neck, or continue if you feel back pain.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate"], 
        muscle: "Back", 
        type: "cooldown",
        // Enhanced exercise information
        resources: {
            googleSearch: "cobra pose exercise proper form technique",
            youtubeSearch: "cobra pose cooldown exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard cobra pose",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Butterfly Stretch", 
        description: "Sit on floor, bring soles of feet together. Gently press your knees towards the floor while keeping back straight. Hold 30-60 seconds. ⚠️ DO: Keep back straight, press knees gently, breathe deeply. DON'T: Force knees down, round back, or continue if you feel groin pain.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "cooldown",
        // Enhanced exercise information
        resources: {
            googleSearch: "butterfly stretch exercise proper form technique",
            youtubeSearch: "butterfly stretch cooldown exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard butterfly stretch",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Spinal Twist", 
        description: "Lie on back, bring one knee across your body, and look in the opposite direction. Hold 30 seconds per side. ⚠️ DO: Keep shoulders on floor, breathe deeply, feel gentle twist. DON'T: Force the twist, lift shoulders, or continue if you feel back pain.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "cooldown",
        // Enhanced exercise information
        resources: {
            googleSearch: "spinal twist exercise proper form technique",
            youtubeSearch: "spinal twist cooldown exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard spinal twist",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Lat Stretch", 
        description: "Kneel or stand beside a wall or bench. Place forearm on surface and lean hips back to feel stretch along the side of torso. Hold 20–30 seconds each side. ⚠️ DO: Keep ribs down and breathe. DON'T: Force the shoulder into pain or shrug.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "cooldown",
        // Enhanced exercise information
        resources: {
            googleSearch: "lat stretch exercise proper form technique",
            youtubeSearch: "lat stretch cooldown exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard lat stretch",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Ankle Hops", 
        description: "Stand tall and perform small, quick hops on the balls of your feet to prime calves and ankles. Keep knees soft and land lightly. ⚠️ DO: Land softly and keep hops small. DON'T: Lock knees or slam heels.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "warmup",
        // Enhanced exercise information
        resources: {
            googleSearch: "ankle hops exercise proper form technique",
            youtubeSearch: "ankle hops warmup exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard ankle hops",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "30-60 seconds",
                main: "Not recommended for main workout"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Hip Openers (Lunge + Circle)", 
        description: "Step into a forward lunge, gently circle the front knee outward for 5 reps, then inward for 5. Switch sides. ⚠️ DO: Move slowly within a comfy range. DON'T: Force deep angles or twist the knee.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "warmup",
        // Enhanced exercise information
        resources: {
            googleSearch: "hip openers (lunge + circle) exercise proper form technique",
            youtubeSearch: "hip openers (lunge + circle) warmup exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard hip openers (lunge + circle)",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "30-60 seconds",
                main: "Not recommended for main workout"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Scapular Pulls", 
        description: "Hang from a bar with straight arms and pull shoulder blades down and together without bending elbows. 6–10 reps. ⚠️ DO: Keep arms straight and control. DON'T: Swing or bend elbows.", 
        equipment: "Pull-up Bar", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "warmup",
        // Enhanced exercise information
        resources: {
            googleSearch: "scapular pulls exercise proper form technique",
            youtubeSearch: "scapular pulls warmup exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard scapular pulls",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "30-60 seconds",
                main: "Not recommended for main workout"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Reverse Lunges", 
        description: "Step one leg back and lower until both knees hit ~90°. Drive through the front heel to stand. Alternate sides. ⚠️ DO: Keep chest up and knee tracking toes. DON'T: Let front knee cave or slam the back knee.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate"], 
        muscle: "Legs", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "reverse lunges exercise proper form technique",
            youtubeSearch: "reverse lunges main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard reverse lunges",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Side Plank", 
        description: "Lie on your side, prop up on forearm, lift hips to form a straight line from head to feet. Hold. ⚠️ DO: Stack shoulders/hips and brace core. DON'T: Let hips sag or rotate.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Core", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "side plank exercise proper form technique",
            youtubeSearch: "side plank main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard side plank",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Bear Crawl", 
        description: "On hands and toes with knees hovering off floor, crawl forward/backward keeping hips low and core tight. ⚠️ DO: Move slow and keep back flat. DON'T: Pike hips or let knees drag.", 
        equipment: "Bodyweight", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "bear crawl exercise proper form technique",
            youtubeSearch: "bear crawl main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard bear crawl",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Hollow Body Hold", 
        description: "Lie on back, press lower back to floor, lift shoulders and legs slightly off ground, arms overhead. Hold. ⚠️ DO: Keep low back pressed down. DON'T: Overarch or hold breath.", 
        equipment: "Bodyweight", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Core", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "hollow body hold exercise proper form technique",
            youtubeSearch: "hollow body hold main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard hollow body hold",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Sumo Squats", 
        description: "Stand wide with toes out 30°, sit hips down keeping chest tall and knees tracking over toes. ⚠️ DO: Push knees out and stay tall. DON'T: Collapse arches or round back.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "sumo squats exercise proper form technique",
            youtubeSearch: "sumo squats main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard sumo squats",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Incline Push-ups", 
        description: "Hands on a bench or countertop, body in line, lower chest to edge and press away. ⚠️ DO: Keep body straight and control depth. DON'T: Flare elbows or drop hips.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate"], 
        muscle: "Chest", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "incline push-ups exercise proper form technique",
            youtubeSearch: "incline push-ups main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard incline push-ups",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Chair Dips", 
        description: "Hands on edge of a sturdy chair, feet forward, bend elbows to lower body then press up. ⚠️ DO: Keep shoulders down/back. DON'T: Let shoulders roll forward or lock out hard.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate"], 
        muscle: "Arms", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "chair dips exercise proper form technique",
            youtubeSearch: "chair dips main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard chair dips",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Kettlebell Swings", 
        description: "Hinge at hips, hike bell back and snap hips forward to chest height, arms relaxed. ⚠️ DO: Hinge, don't squat; snap hips. DON'T: Lift with arms or round back.", 
        equipment: "Kettlebell", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "kettlebell swings exercise proper form technique",
            youtubeSearch: "kettlebell swings main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard kettlebell swings",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "TRX Rows", 
        description: "Hold TRX handles lean back with straight body; pull chest to hands by driving elbows back. ⚠️ DO: Keep core tight and squeeze shoulder blades. DON'T: Shrug or let hips sag.", 
        equipment: "TRX Bands", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "trx rows exercise proper form technique",
            youtubeSearch: "trx rows main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard trx rows",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Band Pull-Aparts", 
        description: "Hold a resistance band at shoulder height; pull ends apart by squeezing shoulder blades. Control return. ⚠️ DO: Keep ribs down and elbows soft. DON'T: Overextend lower back.", 
        equipment: "Resistance Band", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Shoulders", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "band pull-aparts exercise proper form technique",
            youtubeSearch: "band pull-aparts main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard band pull-aparts",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Jump Rope High Knees", 
        description: "Jump rope bringing knees up to hip height each turn at a steady rhythm. ⚠️ DO: Land softly and keep cadence. DON'T: Overstride or slam feet.", 
        equipment: "Jump Rope", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "jump rope high knees exercise proper form technique",
            youtubeSearch: "jump rope high knees main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard jump rope high knees",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Rowing Sprints", 
        description: "On rower, perform short 20–40s sprints focusing on legs-then-hips-then-arms sequence. ⚠️ DO: Maintain form and full strokes. DON'T: Hunch or yank with arms.", 
        equipment: "Rower", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "rowing sprints exercise proper form technique",
            youtubeSearch: "rowing sprints main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard rowing sprints",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Seated Forward Fold", 
        description: "Sit tall with legs extended; hinge forward from hips reaching toward toes. Hold 30–60s. ⚠️ DO: Keep spine long and breathe. DON'T: Bounce or round aggressively.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "cooldown",
        // Enhanced exercise information
        resources: {
            googleSearch: "seated forward fold exercise proper form technique",
            youtubeSearch: "seated forward fold cooldown exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard seated forward fold",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Figure Four Stretch", 
        description: "Lie on back, cross ankle over opposite knee and pull thigh toward chest to stretch glute. Hold 30s each. ⚠️ DO: Pull gently and keep neck relaxed. DON'T: Force the stretch into pain.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "cooldown",
        // Enhanced exercise information
        resources: {
            googleSearch: "figure four stretch exercise proper form technique",
            youtubeSearch: "figure four stretch cooldown exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard figure four stretch",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Upper Trap Stretch", 
        description: "Sit tall, gently tilt ear toward shoulder and use hand to add light pressure. Hold 20–30s per side. ⚠️ DO: Keep shoulders down and breathe. DON'T: Yank the head or twist.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "cooldown",
        // Enhanced exercise information
        resources: {
            googleSearch: "upper trap stretch exercise proper form technique",
            youtubeSearch: "upper trap stretch cooldown exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard upper trap stretch",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Deep Breathing Stretch", 
        description: "Sit cross-legged, place hands on knees, take deep breaths while gently stretching arms overhead. Hold 60 seconds. ⚠️ DO: Breathe deeply and relax into the stretch. DON'T: Force the stretch or hold breath.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "cooldown",
        // Enhanced exercise information
        resources: {
            googleSearch: "deep breathing stretch exercise proper form technique",
            youtubeSearch: "deep breathing stretch cooldown exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard deep breathing stretch",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    
    // Additional Warm-up Exercises (5-minute warm-up)
    { 
        name: "Arm Circles", 
        description: "Stand with arms extended to sides. Make small circles forward for 10 reps, then backward for 10 reps. Gradually increase circle size. ⚠️ DO: Keep movements controlled, start small and increase range. DON'T: Force large circles if shoulders are tight, or continue if you feel shoulder pain.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Shoulders", 
        type: "warmup",
        // Enhanced exercise information
        resources: {
            googleSearch: "arm circles exercise proper form technique",
            youtubeSearch: "arm circles warm up exercise demonstration",
            modifications: {
                beginner: "Start with smaller circles, 5 reps each direction",
                intermediate: "Standard 10 reps each direction",
                advanced: "Add resistance bands or increase circle size"
            },
            timing: {
                warmup: "30-60 seconds",
                main: "Not recommended for main workout"
            },
            progression: ["Small circles → Large circles → With resistance bands"]
        }
    },
    { 
        name: "Scapular Pulls", 
        description: "Hang from a bar with straight arms and pull shoulder blades down and back. Hold for 2 seconds, then release. Do 10-15 reps. ⚠️ DO: Keep arms straight and control the movement. DON'T: Swing or bend elbows.", 
        equipment: "Pull-up Bar", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "warmup",
        // Enhanced exercise information
        resources: {
            googleSearch: "scapular pulls exercise proper form technique",
            youtubeSearch: "scapular pulls warmup exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard scapular pulls",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "30-60 seconds",
                main: "Not recommended for main workout"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Hip Openers (Lunge + Circle)", 
        description: "Step into a forward lunge, gently circle the front hip in both directions. Do 5 circles each direction, then switch legs. ⚠️ DO: Keep movements gentle and controlled, feel hip mobility. DON'T: Force deep angles or twist the knee.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "warmup",
        // Enhanced exercise information
        resources: {
            googleSearch: "hip openers (lunge + circle) exercise proper form technique",
            youtubeSearch: "hip openers (lunge + circle) warmup exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard hip openers (lunge + circle)",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "30-60 seconds",
                main: "Not recommended for main workout"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Walking Lunges", 
        description: "Step forward into a lunge, then bring back leg forward into next lunge. Continue walking forward with controlled lunges. Do 10-15 lunges total. ⚠️ DO: Keep chest up, control the movement, land softly. DON'T: Let knee go past toes, round back, or rush the movement.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "warmup",
        // Enhanced exercise information
        resources: {
            googleSearch: "walking lunges exercise proper form technique",
            youtubeSearch: "walking lunges warmup exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard walking lunges",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "30-60 seconds",
                main: "Not recommended for main workout"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Bear Crawl", 
        description: "Start on hands and knees, lift knees 1-2 inches off ground. Crawl forward by moving opposite hand and foot together. Keep core tight and back flat. ⚠️ DO: Keep core engaged, maintain flat back, move slowly. DON'T: Pike hips or let knees drag.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "warmup",
        // Enhanced exercise information
        resources: {
            googleSearch: "bear crawl exercise proper form technique",
            youtubeSearch: "bear crawl warmup exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard bear crawl",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "30-60 seconds",
                main: "Not recommended for main workout"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Mountain Climbers", 
        description: "Start in plank position. Alternate bringing knees toward chest in running motion. Keep core tight and maintain plank position. ⚠️ DO: Keep hips level, maintain plank form, control the movement. DON'T: Let hips lift, move too fast, or sacrifice form for speed.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "warmup",
        // Enhanced exercise information
        resources: {
            googleSearch: "mountain climbers exercise proper form technique",
            youtubeSearch: "mountain climbers warmup exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard mountain climbers",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "30-60 seconds",
                main: "Not recommended for main workout"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Reverse Lunges", 
        description: "Step one leg back and lower until both knees hit ~90 degrees. Push back to start and repeat. Do 10-15 reps per leg. ⚠️ DO: Keep chest up, control the movement, land softly. DON'T: Let front knee cave or slam the back knee.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "warmup",
        // Enhanced exercise information
        resources: {
            googleSearch: "reverse lunges exercise proper form technique",
            youtubeSearch: "reverse lunges warmup exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard reverse lunges",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "30-60 seconds",
                main: "Not recommended for main workout"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Plank to Downward Dog", 
        description: "Start in plank position. Push hips up and back into downward dog, then return to plank. Move slowly and controlled. ⚠️ DO: Keep core engaged, move with control, feel the stretch. DON'T: Rush the movement, let hips sag, or lose form.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "warmup",
        // Enhanced exercise information
        resources: {
            googleSearch: "plank to downward dog exercise proper form technique",
            youtubeSearch: "plank to downward dog warmup exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard plank to downward dog",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "30-60 seconds",
                main: "Not recommended for main workout"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    
    // Additional Cool-down Exercises (5-minute cool-down)
    { 
        name: "Seated Forward Fold", 
        description: "Sit tall with legs extended; hinge forward from hips, reaching for feet or shins. Hold 30-60 seconds, breathing deeply. ⚠️ DO: Hinge from hips, keep back straight, breathe deeply. DON'T: Bounce or round aggressively.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "cooldown",
        // Enhanced exercise information
        resources: {
            googleSearch: "seated forward fold exercise proper form technique",
            youtubeSearch: "seated forward fold cooldown exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard seated forward fold",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Quad Stretch", 
        description: "Stand on one leg, bend other knee and grab foot behind you. Pull heel toward glutes gently. Hold 30 seconds per side. ⚠️ DO: Keep standing leg soft, pull gently, maintain balance. DON'T: Force the stretch, hold breath, or lose balance.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "cooldown",
        // Enhanced exercise information
        resources: {
            googleSearch: "quad stretch exercise proper form technique",
            youtubeSearch: "quad stretch cooldown exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard quad stretch",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Wall Chest Stretch", 
        description: "Stand facing wall, place forearm against wall at shoulder height. Gently turn body away from wall to feel chest stretch. Hold 30 seconds per side. ⚠️ DO: Keep shoulder relaxed, breathe deeply, feel gentle stretch. DON'T: Force the stretch or continue if you feel shoulder pain.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Chest", 
        type: "cooldown",
        // Enhanced exercise information
        resources: {
            googleSearch: "wall chest stretch exercise proper form technique",
            youtubeSearch: "wall chest stretch cooldown exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard wall chest stretch",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Seated Spinal Twist", 
        description: "Sit with legs extended, bend one knee and place foot outside opposite thigh. Twist torso toward bent knee, placing opposite elbow outside knee. Hold 30 seconds per side. ⚠️ DO: Keep spine tall, breathe deeply, feel gentle twist. DON'T: Force the twist or round back.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "cooldown",
        // Enhanced exercise information
        resources: {
            googleSearch: "seated spinal twist exercise proper form technique",
            youtubeSearch: "seated spinal twist cooldown exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard seated spinal twist",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Standing Forward Fold", 
        description: "Stand with feet hip-width apart, hinge forward from hips and let arms hang. Hold 30-60 seconds, breathing deeply. ⚠️ DO: Hinge from hips, keep knees soft, breathe deeply. DON'T: Bounce or force the stretch.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "cooldown",
        // Enhanced exercise information
        resources: {
            googleSearch: "standing forward fold exercise proper form technique",
            youtubeSearch: "standing forward fold cooldown exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard standing forward fold",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Reclined Butterfly", 
        description: "Lie on back, bring soles of feet together and let knees fall open. Place hands on belly and breathe deeply. Hold 60-90 seconds. ⚠️ DO: Relax into the stretch, breathe deeply, let gravity work. DON'T: Force knees down or hold breath.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "cooldown",
        // Enhanced exercise information
        resources: {
            googleSearch: "reclined butterfly exercise proper form technique",
            youtubeSearch: "reclined butterfly cooldown exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard reclined butterfly",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Supine Twist", 
        description: "Lie on back, bring knees to chest, then let them fall to one side while keeping shoulders on floor. Hold 30 seconds per side. ⚠️ DO: Keep shoulders down, breathe deeply, feel gentle twist. DON'T: Force the twist or lift shoulders.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "cooldown",
        // Enhanced exercise information
        resources: {
            googleSearch: "supine twist exercise proper form technique",
            youtubeSearch: "supine twist cooldown exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard supine twist",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Happy Baby", 
        description: "Lie on back, bring knees to chest and grab outside of feet. Gently rock side to side while holding feet. Hold 30-60 seconds. ⚠️ DO: Keep lower back on floor, breathe deeply, rock gently. DON'T: Force the stretch or lift lower back.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "cooldown",
        // Enhanced exercise information
        resources: {
            googleSearch: "happy baby exercise proper form technique",
            youtubeSearch: "happy baby cooldown exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard happy baby",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Legs Up the Wall", 
        description: "Sit close to wall, swing legs up wall and lie back. Let arms rest at sides and breathe deeply. Hold 2-5 minutes. ⚠️ DO: Relax completely, breathe deeply, let legs rest against wall. DON'T: Force legs against wall or hold breath.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "cooldown",
        // Enhanced exercise information
        resources: {
            googleSearch: "legs up the wall exercise proper form technique",
            youtubeSearch: "legs up the wall cooldown exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard legs up the wall",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Corpse Pose", 
        description: "Lie on back with arms at sides, palms up. Close eyes and focus on deep breathing. Let body completely relax. Hold 3-5 minutes. ⚠️ DO: Relax completely, breathe deeply, let go of tension. DON'T: Fall asleep or hold any tension.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "cooldown",
        // Enhanced exercise information
        resources: {
            googleSearch: "corpse pose exercise proper form technique",
            youtubeSearch: "corpse pose cooldown exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard corpse pose",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    
    // Additional TRX exercises
    { 
        name: "TRX Push-ups", 
        description: "Place feet in TRX straps, assume plank position, perform push-ups while maintaining stability. ⚠️ DO: Keep core tight and control the movement. DON'T: Let hips sag or lose balance.", 
        equipment: "TRX Bands", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Arms", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "trx push-ups exercise proper form technique",
            youtubeSearch: "trx push-ups main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard trx push-ups",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "TRX Squats", 
        description: "Hold TRX handles at chest height, squat down while keeping weight in heels, use straps for balance. ⚠️ DO: Keep chest up and knees over toes. DON'T: Let knees cave inward or round back.", 
        equipment: "TRX Bands", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "trx squats exercise proper form technique",
            youtubeSearch: "trx squats main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard trx squats",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "TRX Lunges", 
        description: "Step back into lunge with one foot in TRX strap, lower until back knee nearly touches ground. ⚠️ DO: Keep front knee over toes and chest up. DON'T: Let front knee go past toes.", 
        equipment: "TRX Bands", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "trx lunges exercise proper form technique",
            youtubeSearch: "trx lunges main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard trx lunges",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "TRX Chest Press", 
        description: "Face away from anchor, lean forward with arms extended, press forward to standing position. ⚠️ DO: Keep core engaged and control the movement. DON'T: Lock elbows or lose balance.", 
        equipment: "TRX Bands", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Arms", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "trx chest press exercise proper form technique",
            youtubeSearch: "trx chest press main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard trx chest press",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "TRX Tricep Extensions", 
        description: "Face anchor, lean forward with arms bent, extend arms to straight position. ⚠️ DO: Keep elbows close to body and control movement. DON'T: Swing or use momentum.", 
        equipment: "TRX Bands", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Arms", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "trx tricep extensions exercise proper form technique",
            youtubeSearch: "trx tricep extensions main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard trx tricep extensions",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "TRX Bicep Curls", 
        description: "Face anchor, hold handles at waist, curl arms up while maintaining body position. ⚠️ DO: Keep elbows stationary and squeeze biceps. DON'T: Swing body or use momentum.", 
        equipment: "TRX Bands", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Arms", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "trx bicep curls exercise proper form technique",
            youtubeSearch: "trx bicep curls main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard trx bicep curls",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "TRX Core Crunches", 
        description: "Lie on back, place feet in TRX straps, perform crunches while maintaining leg position. ⚠️ DO: Engage core and control movement. DON'T: Pull on neck or arch back.", 
        equipment: "TRX Bands", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Core", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "trx core crunches exercise proper form technique",
            youtubeSearch: "trx core crunches main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard trx core crunches",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "TRX Pike", 
        description: "Start in plank with feet in TRX, pike hips up toward ceiling while keeping legs straight. ⚠️ DO: Keep core tight and control movement. DON'T: Let hips drop or swing.", 
        equipment: "TRX Bands", 
        level: ["Advanced"], 
        muscle: "Core", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "trx pike exercise proper form technique",
            youtubeSearch: "trx pike main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard trx pike",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "TRX Hamstring Curls", 
        description: "Lie on back, place heels in TRX straps, curl legs toward glutes while keeping hips up. ⚠️ DO: Keep hips elevated and control movement. DON'T: Let hips drop or swing legs.", 
        equipment: "TRX Bands", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "trx hamstring curls exercise proper form technique",
            youtubeSearch: "trx hamstring curls main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard trx hamstring curls",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "TRX Single Arm Row", 
        description: "Stand sideways to anchor, hold one handle, perform single arm row while maintaining balance. ⚠️ DO: Keep core tight and squeeze shoulder blade. DON'T: Twist body or shrug shoulder.", 
        equipment: "TRX Bands", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "trx single arm row exercise proper form technique",
            youtubeSearch: "trx single arm row main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard trx single arm row",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "TRX Y-Fly", 
        description: "Face anchor, hold handles overhead, perform Y-shaped fly motion while maintaining posture. ⚠️ DO: Keep core engaged and control movement. DON'T: Arch back or use momentum.", 
        equipment: "TRX Bands", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "trx y-fly exercise proper form technique",
            youtubeSearch: "trx y-fly main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard trx y-fly",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "TRX T-Fly", 
        description: "Face anchor, hold handles at chest level, perform T-shaped fly motion for upper back. ⚠️ DO: Keep core tight and squeeze shoulder blades. DON'T: Round back or use momentum.", 
        equipment: "TRX Bands", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "trx t-fly exercise proper form technique",
            youtubeSearch: "trx t-fly main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard trx t-fly",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "TRX Atomic Push-ups", 
        description: "Place feet in TRX straps, perform push-up then bring knees to chest in one fluid motion. ⚠️ DO: Keep core engaged throughout movement. DON'T: Let hips sag or lose control.", 
        equipment: "TRX Bands", 
        level: ["Advanced"], 
        muscle: "Full Body", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "trx atomic push-ups exercise proper form technique",
            youtubeSearch: "trx atomic push-ups main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard trx atomic push-ups",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "TRX Fallout", 
        description: "Kneel facing away from anchor, hold handles at chest, lean forward while maintaining core engagement. ⚠️ DO: Keep core tight and control lean. DON'T: Let back arch or lose balance.", 
        equipment: "TRX Bands", 
        level: ["Advanced"], 
        muscle: "Core", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "trx fallout exercise proper form technique",
            youtubeSearch: "trx fallout main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard trx fallout",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "TRX Suspended Lunge", 
        description: "Place one foot in TRX strap behind you, perform lunge while maintaining balance and form. ⚠️ DO: Keep front knee over toes and chest up. DON'T: Let back knee touch ground hard.", 
        equipment: "TRX Bands", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "trx suspended lunge exercise proper form technique",
            youtubeSearch: "trx suspended lunge main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard trx suspended lunge",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    // Additional Kettlebell exercises
    { 
        name: "Kettlebell Deadlift", 
        description: "Stand with feet shoulder-width apart, hold kettlebell between legs, hinge at hips and lower, then stand up. ⚠️ DO: Keep back straight and push through heels. DON'T: Round back or lift with arms.", 
        equipment: "Kettlebell", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "kettlebell deadlift exercise proper form technique",
            youtubeSearch: "kettlebell deadlift main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard kettlebell deadlift",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Kettlebell Squat", 
        description: "Hold kettlebell at chest level, perform squat while keeping chest up and weight in heels. ⚠️ DO: Keep knees over toes and chest up. DON'T: Let knees cave inward or round back.", 
        equipment: "Kettlebell", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "kettlebell squat exercise proper form technique",
            youtubeSearch: "kettlebell squat main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard kettlebell squat",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Kettlebell Lunge", 
        description: "Hold kettlebell at chest, step forward into lunge, lower until back knee nearly touches ground. ⚠️ DO: Keep front knee over toes and chest up. DON'T: Let front knee go past toes.", 
        equipment: "Kettlebell", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "kettlebell lunge exercise proper form technique",
            youtubeSearch: "kettlebell lunge main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard kettlebell lunge",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Kettlebell Press", 
        description: "Hold kettlebell at shoulder level, press overhead while keeping core engaged and avoiding arch. ⚠️ DO: Keep core tight and press straight up. DON'T: Arch back or lean backward.", 
        equipment: "Kettlebell", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Shoulders", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "kettlebell press exercise proper form technique",
            youtubeSearch: "kettlebell press main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard kettlebell press",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Kettlebell Row", 
        description: "Bend forward at hips, hold kettlebell in one hand, pull elbow back toward hip. ⚠️ DO: Keep back straight and squeeze shoulder blade. DON'T: Round back or swing the weight.", 
        equipment: "Kettlebell", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "kettlebell row exercise proper form technique",
            youtubeSearch: "kettlebell row main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard kettlebell row",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Kettlebell Clean", 
        description: "Start with kettlebell between legs, explosively lift to shoulder level using hip drive. ⚠️ DO: Use hip drive and keep weight close to body. DON'T: Use arms to lift or round back.", 
        equipment: "Kettlebell", 
        level: ["Advanced"], 
        muscle: "Full Body", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "kettlebell clean exercise proper form technique",
            youtubeSearch: "kettlebell clean main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard kettlebell clean",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Kettlebell Snatch", 
        description: "Start with kettlebell between legs, explosively lift overhead in one fluid motion. ⚠️ DO: Use hip drive and keep weight close. DON'T: Use arms to lift or lose control.", 
        equipment: "Kettlebell", 
        level: ["Advanced"], 
        muscle: "Full Body", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "kettlebell snatch exercise proper form technique",
            youtubeSearch: "kettlebell snatch main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard kettlebell snatch",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Kettlebell Turkish Get-up", 
        description: "Lie on back with kettlebell in one hand, perform controlled get-up to standing position. ⚠️ DO: Keep eyes on kettlebell and move slowly. DON'T: Rush or lose control of weight.", 
        equipment: "Kettlebell", 
        level: ["Advanced"], 
        muscle: "Full Body", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "kettlebell turkish get-up exercise proper form technique",
            youtubeSearch: "kettlebell turkish get-up main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard kettlebell turkish get-up",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Kettlebell Windmill", 
        description: "Hold kettlebell overhead with one arm, bend sideways while keeping arm straight. ⚠️ DO: Keep core engaged and control movement. DON'T: Let back arch or lose balance.", 
        equipment: "Kettlebell", 
        level: ["Advanced"], 
        muscle: "Core", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "kettlebell windmill exercise proper form technique",
            youtubeSearch: "kettlebell windmill main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard kettlebell windmill",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Kettlebell Figure-8", 
        description: "Stand with feet wide, pass kettlebell in figure-8 pattern between legs while maintaining stance. ⚠️ DO: Keep core engaged and control movement. DON'T: Let back round or lose balance.", 
        equipment: "Kettlebell", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Core", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "kettlebell figure-8 exercise proper form technique",
            youtubeSearch: "kettlebell figure-8 main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard kettlebell figure-8",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Kettlebell Halo", 
        description: "Hold kettlebell at chest level, circle it around head while keeping core engaged. ⚠️ DO: Keep core tight and control movement. DON'T: Let back arch or lose balance.", 
        equipment: "Kettlebell", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Core", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "kettlebell halo exercise proper form technique",
            youtubeSearch: "kettlebell halo main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard kettlebell halo",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Kettlebell Thruster", 
        description: "Hold kettlebell at chest, squat down, then explosively stand and press overhead. ⚠️ DO: Use hip drive and keep core engaged. DON'T: Round back or use arms to lift.", 
        equipment: "Kettlebell", 
        level: ["Advanced"], 
        muscle: "Full Body", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "kettlebell thruster exercise proper form technique",
            youtubeSearch: "kettlebell thruster main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard kettlebell thruster",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Kettlebell Sumo Deadlift", 
        description: "Stand with wide stance, hold kettlebell between legs, hinge at hips and lift. ⚠️ DO: Keep back straight and push through heels. DON'T: Round back or lift with arms.", 
        equipment: "Kettlebell", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "kettlebell sumo deadlift exercise proper form technique",
            youtubeSearch: "kettlebell sumo deadlift main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard kettlebell sumo deadlift",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Kettlebell Single Leg Deadlift", 
        description: "Stand on one leg, hold kettlebell in opposite hand, hinge at hips while extending free leg back. ⚠️ DO: Keep back straight and control movement. DON'T: Round back or lose balance.", 
        equipment: "Kettlebell", 
        level: ["Advanced"], 
        muscle: "Legs", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "kettlebell single leg deadlift exercise proper form technique",
            youtubeSearch: "kettlebell single leg deadlift main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard kettlebell single leg deadlift",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Kettlebell Side Lunge", 
        description: "Hold kettlebell at chest, step to side into lunge, lower while keeping weight centered. ⚠️ DO: Keep chest up and knees over toes. DON'T: Let knees cave inward.", 
        equipment: "Kettlebell", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "kettlebell side lunge exercise proper form technique",
            youtubeSearch: "kettlebell side lunge main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard kettlebell side lunge",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Kettlebell Step-up", 
        description: "Hold kettlebell at chest, step up onto elevated surface, drive through front foot. ⚠️ DO: Keep chest up and drive through front foot. DON'T: Push off back foot or round back.", 
        equipment: "Kettlebell", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "kettlebell step-up exercise proper form technique",
            youtubeSearch: "kettlebell step-up main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard kettlebell step-up",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    // Additional Resistance Band exercises
    { 
        name: "Resistance Band Squats", 
        description: "Stand on band with feet shoulder-width, hold handles at shoulders, perform squat while maintaining tension. ⚠️ DO: Keep chest up and knees over toes. DON'T: Let knees cave inward.", 
        equipment: "Resistance Band", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "resistance band squats exercise proper form technique",
            youtubeSearch: "resistance band squats main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard resistance band squats",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Resistance Band Rows", 
        description: "Anchor band at chest height, hold handles, pull elbows back while squeezing shoulder blades. ⚠️ DO: Keep core engaged and squeeze shoulder blades. DON'T: Round back or use momentum.", 
        equipment: "Resistance Band", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "resistance band rows exercise proper form technique",
            youtubeSearch: "resistance band rows main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard resistance band rows",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Resistance Band Chest Press", 
        description: "Anchor band behind back, hold handles at chest, press forward while maintaining posture. ⚠️ DO: Keep core engaged and control movement. DON'T: Round back or lock elbows.", 
        equipment: "Resistance Band", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Arms", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "resistance band chest press exercise proper form technique",
            youtubeSearch: "resistance band chest press main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard resistance band chest press",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Resistance Band Bicep Curls", 
        description: "Stand on band with feet shoulder-width, hold handles at sides, curl arms up while maintaining tension. ⚠️ DO: Keep elbows stationary and squeeze biceps. DON'T: Swing body or use momentum.", 
        equipment: "Resistance Band", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Arms", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "resistance band bicep curls exercise proper form technique",
            youtubeSearch: "resistance band bicep curls main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard resistance band bicep curls",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Resistance Band Tricep Extensions", 
        description: "Anchor band overhead, hold handles behind head, extend arms overhead while maintaining tension. ⚠️ DO: Keep elbows close to head and control movement. DON'T: Swing or use momentum.", 
        equipment: "Resistance Band", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Arms", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "resistance band tricep extensions exercise proper form technique",
            youtubeSearch: "resistance band tricep extensions main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard resistance band tricep extensions",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Resistance Band Lateral Raises", 
        description: "Stand on band with feet shoulder-width, hold handles at sides, raise arms to shoulder level. ⚠️ DO: Keep core engaged and control movement. DON'T: Swing or use momentum.", 
        equipment: "Resistance Band", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Shoulders", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "resistance band lateral raises exercise proper form technique",
            youtubeSearch: "resistance band lateral raises main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard resistance band lateral raises",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Resistance Band Front Raises", 
        description: "Stand on band with feet shoulder-width, hold handles at thighs, raise arms to shoulder level. ⚠️ DO: Keep core engaged and control movement. DON'T: Swing or use momentum.", 
        equipment: "Resistance Band", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Shoulders", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "resistance band front raises exercise proper form technique",
            youtubeSearch: "resistance band front raises main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard resistance band front raises",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Resistance Band Deadlift", 
        description: "Stand on band with feet shoulder-width, hold handles at thighs, hinge at hips and lower, then stand up. ⚠️ DO: Keep back straight and push through heels. DON'T: Round back or lift with arms.", 
        equipment: "Resistance Band", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "resistance band deadlift exercise proper form technique",
            youtubeSearch: "resistance band deadlift main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard resistance band deadlift",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Resistance Band Lunges", 
        description: "Step back into lunge with band under front foot, hold handles at chest, perform lunge. ⚠️ DO: Keep front knee over toes and chest up. DON'T: Let front knee go past toes.", 
        equipment: "Resistance Band", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "resistance band lunges exercise proper form technique",
            youtubeSearch: "resistance band lunges main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard resistance band lunges",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Resistance Band Glute Bridge", 
        description: "Lie on back with band above knees, bend knees, lift hips while pressing knees outward. ⚠️ DO: Keep core engaged and squeeze glutes. DON'T: Arch back or let knees cave inward.", 
        equipment: "Resistance Band", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "resistance band glute bridge exercise proper form technique",
            youtubeSearch: "resistance band glute bridge main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard resistance band glute bridge",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Resistance Band Clamshells", 
        description: "Lie on side with band above knees, bend knees, open top knee while keeping feet together. ⚠️ DO: Keep core engaged and control movement. DON'T: Let hips roll or use momentum.", 
        equipment: "Resistance Band", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "resistance band clamshells exercise proper form technique",
            youtubeSearch: "resistance band clamshells main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard resistance band clamshells",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Resistance Band Side Steps", 
        description: "Place band above knees, step to side while maintaining tension, alternate directions. ⚠️ DO: Keep tension on band and control movement. DON'T: Let knees cave inward.", 
        equipment: "Resistance Band", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "resistance band side steps exercise proper form technique",
            youtubeSearch: "resistance band side steps main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard resistance band side steps",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Resistance Band Woodchoppers", 
        description: "Anchor band at shoulder height, hold handles with both hands, rotate torso while pulling across body. ⚠️ DO: Keep core engaged and control rotation. DON'T: Use momentum or round back.", 
        equipment: "Resistance Band", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Core", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "resistance band woodchoppers exercise proper form technique",
            youtubeSearch: "resistance band woodchoppers main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard resistance band woodchoppers",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Resistance Band Pallof Press", 
        description: "Anchor band at chest height, hold handles with both hands, press forward while resisting rotation. ⚠️ DO: Keep core engaged and resist rotation. DON'T: Let body twist or round back.", 
        equipment: "Resistance Band", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Core", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "resistance band pallof press exercise proper form technique",
            youtubeSearch: "resistance band pallof press main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard resistance band pallof press",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Resistance Band Face Pulls", 
        description: "Anchor band at face height, hold handles with both hands, pull toward face while keeping elbows high. ⚠️ DO: Keep elbows high and squeeze shoulder blades. DON'T: Round back or use momentum.", 
        equipment: "Resistance Band", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "resistance band face pulls exercise proper form technique",
            youtubeSearch: "resistance band face pulls main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard resistance band face pulls",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Resistance Band Reverse Fly", 
        description: "Anchor band at chest height, hold handles with arms extended, pull arms back while squeezing shoulder blades. ⚠️ DO: Keep core engaged and squeeze shoulder blades. DON'T: Round back or use momentum.", 
        equipment: "Resistance Band", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "resistance band reverse fly exercise proper form technique",
            youtubeSearch: "resistance band reverse fly main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard resistance band reverse fly",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Resistance Band Upright Rows", 
        description: "Stand on band with feet shoulder-width, hold handles at thighs, pull elbows up to shoulder level. ⚠️ DO: Keep core engaged and control movement. DON'T: Shrug shoulders or use momentum.", 
        equipment: "Resistance Band", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Shoulders", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "resistance band upright rows exercise proper form technique",
            youtubeSearch: "resistance band upright rows main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard resistance band upright rows",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Resistance Band Shrugs", 
        description: "Stand on band with feet shoulder-width, hold handles at sides, shrug shoulders up and down. ⚠️ DO: Keep core engaged and control movement. DON'T: Round back or use momentum.", 
        equipment: "Resistance Band", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "resistance band shrugs exercise proper form technique",
            youtubeSearch: "resistance band shrugs main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard resistance band shrugs",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    // Additional Pull-up Bar exercises
    { 
        name: "Pull-up Bar Hanging Leg Raises", 
        description: "Hang from pull-up bar, raise legs to parallel or higher while keeping core engaged. ⚠️ DO: Keep core tight and control movement. DON'T: Swing or use momentum.", 
        equipment: "Pull-up Bar", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Core", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "pull-up bar hanging leg raises exercise proper form technique",
            youtubeSearch: "pull-up bar hanging leg raises main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard pull-up bar hanging leg raises",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Pull-up Bar Knee Tucks", 
        description: "Hang from pull-up bar, bring knees toward chest while keeping core engaged. ⚠️ DO: Keep core tight and control movement. DON'T: Swing or use momentum.", 
        equipment: "Pull-up Bar", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Core", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "pull-up bar knee tucks exercise proper form technique",
            youtubeSearch: "pull-up bar knee tucks main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard pull-up bar knee tucks",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Pull-up Bar L-Sit", 
        description: "Hang from pull-up bar, lift legs to form L-shape while keeping core engaged. ⚠️ DO: Keep core tight and hold position. DON'T: Round back or let legs drop.", 
        equipment: "Pull-up Bar", 
        level: ["Advanced"], 
        muscle: "Core", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "pull-up bar l-sit exercise proper form technique",
            youtubeSearch: "pull-up bar l-sit main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard pull-up bar l-sit",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Pull-up Bar Windshield Wipers", 
        description: "Hang from pull-up bar, swing legs side to side while keeping core engaged. ⚠️ DO: Keep core tight and control movement. DON'T: Swing too fast or lose control.", 
        equipment: "Pull-up Bar", 
        level: ["Advanced"], 
        muscle: "Core", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "pull-up bar windshield wipers exercise proper form technique",
            youtubeSearch: "pull-up bar windshield wipers main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard pull-up bar windshield wipers",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Pull-up Bar Toes to Bar", 
        description: "Hang from pull-up bar, raise legs to touch bar with toes while keeping core engaged. ⚠️ DO: Keep core tight and control movement. DON'T: Swing or use momentum.", 
        equipment: "Pull-up Bar", 
        level: ["Advanced"], 
        muscle: "Core", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "pull-up bar toes to bar exercise proper form technique",
            youtubeSearch: "pull-up bar toes to bar main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard pull-up bar toes to bar",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Pull-up Bar Hanging Scissors", 
        description: "Hang from pull-up bar, alternate raising legs in scissor motion while keeping core engaged. ⚠️ DO: Keep core tight and control movement. DON'T: Swing or use momentum.", 
        equipment: "Pull-up Bar", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Core", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "pull-up bar hanging scissors exercise proper form technique",
            youtubeSearch: "pull-up bar hanging scissors main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard pull-up bar hanging scissors",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Pull-up Bar Hanging Bicycles", 
        description: "Hang from pull-up bar, perform bicycle motion with legs while keeping core engaged. ⚠️ DO: Keep core tight and control movement. DON'T: Swing or use momentum.", 
        equipment: "Pull-up Bar", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Core", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "pull-up bar hanging bicycles exercise proper form technique",
            youtubeSearch: "pull-up bar hanging bicycles main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard pull-up bar hanging bicycles",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Pull-up Bar Hanging Side Crunches", 
        description: "Hang from pull-up bar, bring knees toward opposite shoulder while keeping core engaged. ⚠️ DO: Keep core tight and control movement. DON'T: Swing or use momentum.", 
        equipment: "Pull-up Bar", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Core", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "pull-up bar hanging side crunches exercise proper form technique",
            youtubeSearch: "pull-up bar hanging side crunches main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard pull-up bar hanging side crunches",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Pull-up Bar Hanging Oblique Twists", 
        description: "Hang from pull-up bar, twist legs side to side while keeping core engaged. ⚠️ DO: Keep core tight and control movement. DON'T: Swing or use momentum.", 
        equipment: "Pull-up Bar", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Core", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "pull-up bar hanging oblique twists exercise proper form technique",
            youtubeSearch: "pull-up bar hanging oblique twists main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard pull-up bar hanging oblique twists",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Pull-up Bar Hanging Pike", 
        description: "Hang from pull-up bar, raise legs toward bar while keeping core engaged and legs straight. ⚠️ DO: Keep core tight and control movement. DON'T: Swing or use momentum.", 
        equipment: "Pull-up Bar", 
        level: ["Advanced"], 
        muscle: "Core", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "pull-up bar hanging pike exercise proper form technique",
            youtubeSearch: "pull-up bar hanging pike main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard pull-up bar hanging pike",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Pull-up Bar Hanging Knee Circles", 
        description: "Hang from pull-up bar, draw circles with knees while keeping core engaged. ⚠️ DO: Keep core tight and control movement. DON'T: Swing or use momentum.", 
        equipment: "Pull-up Bar", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Core", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "pull-up bar hanging knee circles exercise proper form technique",
            youtubeSearch: "pull-up bar hanging knee circles main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard pull-up bar hanging knee circles",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Pull-up Bar Hanging Figure-8", 
        description: "Hang from pull-up bar, move legs in figure-8 pattern while keeping core engaged. ⚠️ DO: Keep core tight and control movement. DON'T: Swing or use momentum.", 
        equipment: "Pull-up Bar", 
        level: ["Advanced"], 
        muscle: "Core", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "pull-up bar hanging figure-8 exercise proper form technique",
            youtubeSearch: "pull-up bar hanging figure-8 main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard pull-up bar hanging figure-8",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Pull-up Bar Hanging Side Leg Raises", 
        description: "Hang from pull-up bar, raise legs to side while keeping core engaged. ⚠️ DO: Keep core tight and control movement. DON'T: Swing or use momentum.", 
        equipment: "Pull-up Bar", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Core", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "pull-up bar hanging side leg raises exercise proper form technique",
            youtubeSearch: "pull-up bar hanging side leg raises main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard pull-up bar hanging side leg raises",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Pull-up Bar Hanging Knee Tucks with Twist", 
        description: "Hang from pull-up bar, bring knees toward chest while twisting to one side, alternate sides. ⚠️ DO: Keep core tight and control movement. DON'T: Swing or use momentum.", 
        equipment: "Pull-up Bar", 
        level: ["Advanced"], 
        muscle: "Core", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "pull-up bar hanging knee tucks with twist exercise proper form technique",
            youtubeSearch: "pull-up bar hanging knee tucks with twist main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard pull-up bar hanging knee tucks with twist",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Pull-up Bar Hanging Leg Extensions", 
        description: "Hang from pull-up bar, extend legs straight out while keeping core engaged. ⚠️ DO: Keep core tight and control movement. DON'T: Swing or use momentum.", 
        equipment: "Pull-up Bar", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Core", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "pull-up bar hanging leg extensions exercise proper form technique",
            youtubeSearch: "pull-up bar hanging leg extensions main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard pull-up bar hanging leg extensions",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Pull-up Bar Hanging Knee Raises with Hold", 
        description: "Hang from pull-up bar, raise knees to chest and hold position while keeping core engaged. ⚠️ DO: Keep core tight and hold position. DON'T: Swing or use momentum.", 
        equipment: "Pull-up Bar", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Core", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "pull-up bar hanging knee raises with hold exercise proper form technique",
            youtubeSearch: "pull-up bar hanging knee raises with hold main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard pull-up bar hanging knee raises with hold",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    // Additional Jump Rope exercises
    { 
        name: "Jump Rope High Knees", 
        description: "Jump rope while bringing knees up toward chest with each jump. ⚠️ DO: Keep core engaged and land softly. DON'T: Land hard or let knees cave inward.", 
        equipment: "Jump Rope", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "jump rope high knees exercise proper form technique",
            youtubeSearch: "jump rope high knees main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard jump rope high knees",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Jump Rope Butt Kicks", 
        description: "Jump rope while kicking heels toward glutes with each jump. ⚠️ DO: Keep core engaged and land softly. DON'T: Land hard or let knees cave inward.", 
        equipment: "Jump Rope", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "jump rope butt kicks exercise proper form technique",
            youtubeSearch: "jump rope butt kicks main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard jump rope butt kicks",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Jump Rope Side to Side", 
        description: "Jump rope while moving side to side with each jump. ⚠️ DO: Keep core engaged and land softly. DON'T: Land hard or lose balance.", 
        equipment: "Jump Rope", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "jump rope side to side exercise proper form technique",
            youtubeSearch: "jump rope side to side main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard jump rope side to side",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Jump Rope Forward Backward", 
        description: "Jump rope while moving forward and backward with each jump. ⚠️ DO: Keep core engaged and land softly. DON'T: Land hard or lose balance.", 
        equipment: "Jump Rope", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "jump rope forward backward exercise proper form technique",
            youtubeSearch: "jump rope forward backward main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard jump rope forward backward",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Jump Rope Double Unders", 
        description: "Jump rope while making rope pass under feet twice per jump. ⚠️ DO: Keep core engaged and jump higher. DON'T: Land hard or lose rhythm.", 
        equipment: "Jump Rope", 
        level: ["Advanced"], 
        muscle: "Full Body", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "jump rope double unders exercise proper form technique",
            youtubeSearch: "jump rope double unders main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard jump rope double unders",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Jump Rope Crossovers", 
        description: "Jump rope while crossing arms in front of body with each jump. ⚠️ DO: Keep core engaged and land softly. DON'T: Land hard or lose rhythm.", 
        equipment: "Jump Rope", 
        level: ["Advanced"], 
        muscle: "Full Body", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "jump rope crossovers exercise proper form technique",
            youtubeSearch: "jump rope crossovers main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard jump rope crossovers",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Jump Rope Single Leg", 
        description: "Jump rope while hopping on one leg, alternate legs. ⚠️ DO: Keep core engaged and land softly. DON'T: Land hard or lose balance.", 
        equipment: "Jump Rope", 
        level: ["Advanced"], 
        muscle: "Full Body", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "jump rope single leg exercise proper form technique",
            youtubeSearch: "jump rope single leg main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard jump rope single leg",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Jump Rope Criss Cross", 
        description: "Jump rope while crossing legs in front and back with each jump. ⚠️ DO: Keep core engaged and land softly. DON'T: Land hard or lose rhythm.", 
        equipment: "Jump Rope", 
        level: ["Advanced"], 
        muscle: "Full Body", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "jump rope criss cross exercise proper form technique",
            youtubeSearch: "jump rope criss cross main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard jump rope criss cross",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Jump Rope Boxer Skip", 
        description: "Jump rope while moving feet in boxing shuffle pattern. ⚠️ DO: Keep core engaged and land softly. DON'T: Land hard or lose rhythm.", 
        equipment: "Jump Rope", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "jump rope boxer skip exercise proper form technique",
            youtubeSearch: "jump rope boxer skip main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard jump rope boxer skip",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Jump Rope Heel Toe", 
        description: "Jump rope while alternating heel and toe touches with each jump. ⚠️ DO: Keep core engaged and land softly. DON'T: Land hard or lose rhythm.", 
        equipment: "Jump Rope", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "jump rope heel toe exercise proper form technique",
            youtubeSearch: "jump rope heel toe main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard jump rope heel toe",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Jump Rope Jumping Jacks", 
        description: "Jump rope while performing jumping jack motion with each jump. ⚠️ DO: Keep core engaged and land softly. DON'T: Land hard or lose rhythm.", 
        equipment: "Jump Rope", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "jump rope jumping jacks exercise proper form technique",
            youtubeSearch: "jump rope jumping jacks main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard jump rope jumping jacks",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Jump Rope Skier", 
        description: "Jump rope while moving feet side to side like skiing. ⚠️ DO: Keep core engaged and land softly. DON'T: Land hard or lose balance.", 
        equipment: "Jump Rope", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "jump rope skier exercise proper form technique",
            youtubeSearch: "jump rope skier main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard jump rope skier",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Jump Rope Mummy Kicks", 
        description: "Jump rope while kicking legs forward like a mummy walk. ⚠️ DO: Keep core engaged and land softly. DON'T: Land hard or lose balance.", 
        equipment: "Jump Rope", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "jump rope mummy kicks exercise proper form technique",
            youtubeSearch: "jump rope mummy kicks main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard jump rope mummy kicks",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Jump Rope Bell", 
        description: "Jump rope while jumping in place with feet together. ⚠️ DO: Keep core engaged and land softly. DON'T: Land hard or let knees cave inward.", 
        equipment: "Jump Rope", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "jump rope bell exercise proper form technique",
            youtubeSearch: "jump rope bell main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard jump rope bell",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Jump Rope Scissors", 
        description: "Jump rope while alternating feet forward and back with each jump. ⚠️ DO: Keep core engaged and land softly. DON'T: Land hard or lose rhythm.", 
        equipment: "Jump Rope", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "jump rope scissors exercise proper form technique",
            youtubeSearch: "jump rope scissors main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard jump rope scissors",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Jump Rope Can Can", 
        description: "Jump rope while kicking one leg up and out to the side with each jump. ⚠️ DO: Keep core engaged and land softly. DON'T: Land hard or lose balance.", 
        equipment: "Jump Rope", 
        level: ["Advanced"], 
        muscle: "Full Body", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "jump rope can can exercise proper form technique",
            youtubeSearch: "jump rope can can main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard jump rope can can",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Jump Rope Russian", 
        description: "Jump rope while alternating feet in Russian dance pattern. ⚠️ DO: Keep core engaged and land softly. DON'T: Land hard or lose rhythm.", 
        equipment: "Jump Rope", 
        level: ["Advanced"], 
        muscle: "Full Body", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "jump rope russian exercise proper form technique",
            youtubeSearch: "jump rope russian main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard jump rope russian",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    // Additional Rower exercises
    { 
        name: "Rower Intervals", 
        description: "Alternate between 30 seconds hard rowing and 30 seconds easy rowing. ⚠️ DO: Maintain proper form and control breathing. DON'T: Sacrifice form for speed.", 
        equipment: "Rower", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "rower intervals exercise proper form technique",
            youtubeSearch: "rower intervals main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard rower intervals",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Rower Pyramid", 
        description: "Start with 100m, increase by 100m each round, then decrease back down. ⚠️ DO: Maintain proper form throughout. DON'T: Sacrifice form for distance.", 
        equipment: "Rower", 
        level: ["Advanced"], 
        muscle: "Full Body", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "rower pyramid exercise proper form technique",
            youtubeSearch: "rower pyramid main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard rower pyramid",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Rower Tabata", 
        description: "20 seconds hard rowing, 10 seconds rest, repeat 8 times. ⚠️ DO: Maintain proper form and push hard during work periods. DON'T: Sacrifice form for intensity.", 
        equipment: "Rower", 
        level: ["Advanced"], 
        muscle: "Full Body", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "rower tabata exercise proper form technique",
            youtubeSearch: "rower tabata main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard rower tabata",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Rower Distance Challenge", 
        description: "Row for distance with consistent pace over 5-10 minutes. ⚠️ DO: Maintain proper form and steady pace. DON'T: Start too fast or sacrifice form.", 
        equipment: "Rower", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "rower distance challenge exercise proper form technique",
            youtubeSearch: "rower distance challenge main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard rower distance challenge",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Rower Power Strokes", 
        description: "Focus on powerful leg drive and strong finish with each stroke. ⚠️ DO: Use legs first, then body, then arms. DON'T: Use only arms or round back.", 
        equipment: "Rower", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "rower power strokes exercise proper form technique",
            youtubeSearch: "rower power strokes main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard rower power strokes",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Rower Technique Focus", 
        description: "Row at moderate pace focusing on perfect form and smooth transitions. ⚠️ DO: Maintain proper sequence and smooth movement. DON'T: Rush or break form.", 
        equipment: "Rower", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "rower technique focus exercise proper form technique",
            youtubeSearch: "rower technique focus main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard rower technique focus",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Rower Endurance", 
        description: "Row at steady pace for 15-30 minutes building cardiovascular endurance. ⚠️ DO: Maintain consistent pace and proper form. DON'T: Start too fast or sacrifice form.", 
        equipment: "Rower", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "rower endurance exercise proper form technique",
            youtubeSearch: "rower endurance main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard rower endurance",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    },
    { 
        name: "Rower Sprint Finish", 
        description: "Row at moderate pace, finish last 2 minutes with maximum effort sprint. ⚠️ DO: Maintain proper form even during sprint. DON'T: Sacrifice form for speed.", 
        equipment: "Rower", 
        level: ["Advanced"], 
        muscle: "Full Body", 
        type: "main",
        // Enhanced exercise information
        resources: {
            googleSearch: "rower sprint finish exercise proper form technique",
            youtubeSearch: "rower sprint finish main exercise tutorial",
            modifications: {
                beginner: "Start with easier variation or reduced range",
                intermediate: "Standard rower sprint finish",
                advanced: "Add intensity or advanced variations"
            },
            timing: {
                warmup: "Not recommended for warm-up",
                main: "45-60 seconds work, 15-30 seconds rest"
            },
            progression: ["Beginner variation → Standard → Advanced → Expert level"]
        } 
    }
];

// Export additional exercise-related functions
export const exerciseDatabase = {
    exercises,
    
    /**
     * Get all exercises of a specific type
     * @param {string} type - Exercise type (warmup, main, cooldown)
     * @returns {Array} Filtered exercises
     */
    getExercisesByType(type) {
        return exercises.filter(ex => ex.type === type);
    },
    
    /**
     * Get exercises by equipment requirement
     * @param {string} equipment - Equipment type
     * @returns {Array} Filtered exercises
     */
    getExercisesByEquipment(equipment) {
        return exercises.filter(ex => 
            ex.equipment === equipment || 
            (ex.equipment_needed && ex.equipment_needed.includes(equipment))
        );
    },
    
    /**
     * Get exercises by difficulty level
     * @param {string} level - Difficulty level
     * @returns {Array} Filtered exercises
     */
    getExercisesByLevel(level) {
        return exercises.filter(ex => 
            ex.level === level || 
            (Array.isArray(ex.level) && ex.level.includes(level))
        );
    },
    
    /**
     * Find exercise by name
     * @param {string} name - Exercise name
     * @returns {Object|null} Exercise object or null
     */
    findExerciseByName(name) {
        return exercises.find(ex => ex.name === name) || null;
    }
};
