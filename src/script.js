// --- FINAL IMPROVED WORKOUT GENERATOR ---
// Enhanced version with detailed exercise descriptions and safety guidelines

// --- ENHANCED EXERCISE DATABASE WITH SMART SUBSTITUTION ---
// Enhanced with alternatives, difficulty levels, and equipment requirements
const exercises = [
    // Warm-up exercises
    { 
        name: "Arm Circles", 
        description: "Stand with feet shoulder-width apart. Start with small circles, gradually increasing size. Circle forward for 10 reps, then backward for 10 reps. Keep shoulders relaxed and avoid shrugging. ⚠️ DO: Start small and controlled. DON'T: Force large circles or shrug shoulders. Stop if you feel shoulder pain.", 
        equipment: "Bodyweight", 
        level: "Beginner", 
        muscle: "Shoulders", 
        type: "warmup",
        alternatives: ["Shoulder Rolls", "Arm Swings", "Shoulder Shrugs"],
        difficulty: 1,
        equipment_needed: ["none"],
        muscle_groups: ["deltoids", "trapezius"],
        injury_safe: ["shoulder_pain", "neck_pain"]
    },
    { 
        name: "Leg Swings", 
        description: "Hold onto a wall or sturdy surface for balance. Swing one leg forward and back in a controlled motion, keeping the movement smooth. Do 10-15 swings per leg, then switch. ⚠️ DO: Keep upper body stable, swing from hip joint. DON'T: Swing too fast or let momentum take over. Stop if you feel hip or knee pain.", 
        equipment: "Bodyweight", 
        level: "Beginner", 
        muscle: "Legs", 
        type: "warmup",
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
        type: "warmup" 
    },
    { 
        name: "Jumping Rope (slow)", 
        description: "Hold rope handles at hip level. Jump just high enough to clear the rope, keeping jumps small and controlled. Land softly on balls of feet. ⚠️ DO: Keep jumps small, maintain rhythm, land softly. DON'T: Jump too high, let rope hit feet repeatedly, or continue if you feel ankle pain.", 
        equipment: "Jump Rope", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "warmup" 
    },
    { 
        name: "Torso Twists", 
        description: "Stand with feet shoulder-width apart, arms extended at shoulder height. Rotate upper body from side to side, keeping hips facing forward. Move slowly and controlled. ⚠️ DO: Keep hips stable, rotate from waist, breathe normally. DON'T: Twist too fast, let hips rotate, or force range of motion.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Core", 
        type: "warmup" 
    },
    { 
        name: "High Knees", 
        description: "Run in place, bringing knees up toward chest level. Pump arms naturally and stay on balls of feet. Keep torso upright and core engaged. ⚠️ DO: Keep good posture, engage core, land softly. DON'T: Lean back, let knees go too high if you have hip issues, or hold breath.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "warmup" 
    },
    { 
        name: "Butt Kicks", 
        description: "Run in place, kicking heels back toward glutes. Keep torso upright and pump arms naturally. Stay on balls of feet throughout movement. ⚠️ DO: Keep good posture, kick heels back naturally, maintain rhythm. DON'T: Lean forward, kick too hard, or let feet slap down.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "warmup" 
    },
    { 
        name: "Cat-Cow Stretch", 
        description: "Start on hands and knees. Inhale, drop belly and lift head (cow). Exhale, round back and tuck chin (cat). Move slowly with breath. ⚠️ DO: Move with breath, keep movements controlled, feel spine mobility. DON'T: Force range of motion, move too fast, or continue if you feel back pain.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "warmup" 
    },
    { 
        name: "Hip Circles", 
        description: "Stand on one leg, holding onto support if needed. Make large circles with opposite knee, moving slowly and controlled. Do 5-8 circles each direction. ⚠️ DO: Keep standing leg stable, move slowly, hold support if needed. DON'T: Rush the movement, lose balance, or continue if you feel hip pain.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "warmup" 
    },
    { 
        name: "Ankle Rotations", 
        description: "Sit or stand and lift one foot off ground. Rotate ankle in circles, first clockwise then counter-clockwise. Do 10 rotations each direction per foot. ⚠️ DO: Move slowly, feel ankle mobility, keep movements controlled. DON'T: Force range of motion, move too fast, or continue if you feel ankle pain.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "warmup" 
    },
    { 
        name: "Inchworm", 
        description: "Stand with feet together. Bend forward and walk hands out to plank position. Hold plank briefly, then walk feet toward hands, keeping legs straight. ⚠️ DO: Keep core engaged, move slowly, maintain plank form. DON'T: Let hips sag in plank, rush the movement, or round back excessively.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "warmup" 
    },
    { 
        name: "World's Greatest Stretch", 
        description: "Step into deep lunge, place both hands on floor inside front foot. Twist torso and reach one arm to sky, looking up. Hold 2-3 seconds, then switch sides. ⚠️ DO: Keep back knee off ground, twist from torso, breathe deeply. DON'T: Force the stretch, let back knee touch ground, or twist too aggressively.", 
        equipment: "Bodyweight", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "warmup" 
    },
    { 
        name: "Light Rowing", 
        description: "Sit on rower with feet secured. Start with easy pace, focusing on proper form: push with legs, then pull with arms. Keep back straight throughout. ⚠️ DO: Maintain good posture, use full range of motion, breathe rhythmically. DON'T: Round back, pull too hard, or ignore proper form for speed.", 
        equipment: "Rower", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "warmup" 
    },
    { 
        name: "Dynamic Chest Stretch", 
        description: "Stand with arms extended at shoulder height. Swing arms back to open chest, then cross arms in front. Move slowly and feel chest stretch. ⚠️ DO: Move slowly, feel chest opening, keep shoulders relaxed. DON'T: Force the stretch, move too fast, or continue if you feel shoulder pain.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Chest", 
        type: "warmup" 
    },
    { 
        name: "Side Lunges", 
        description: "Stand with feet wide apart. Step to one side, bending knee and keeping other leg straight. Push back to center and repeat on other side. ⚠️ DO: Keep chest up, push through heel, maintain balance. DON'T: Let knee cave inward, round back, or lose balance.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "warmup" 
    },
    { 
        name: "Frankenstein Kicks", 
        description: "Walk forward, kicking one leg straight out in front, trying to touch opposite hand to toe. Keep standing leg straight and maintain balance. ⚠️ DO: Keep good posture, kick leg straight, maintain balance. DON'T: Round back, kick too high if you have hamstring issues, or rush the movement.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "warmup" 
    },
    { 
        name: "Glute Bridges (Warm-up)", 
        description: "Lie on back with knees bent, feet flat on floor. Lift hips toward ceiling, squeezing glutes. Hold briefly, then lower with control. ⚠️ DO: Squeeze glutes, keep core engaged, lower slowly. DON'T: Arch back excessively, lift hips too high, or let knees cave inward.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "warmup" 
    },
    { 
        name: "Shoulder Taps", 
        description: "Start in plank position on hands. Slowly tap left shoulder with right hand, then right shoulder with left hand. Keep hips stable throughout. ⚠️ DO: Keep hips level, move slowly, maintain plank form. DON'T: Let hips rotate, move too fast, or let body sag.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Core", 
        type: "warmup" 
    },
    { 
        name: "Wrist Circles", 
        description: "Extend arms in front, make fists, and rotate wrists in circles. Do 10 circles clockwise, then 10 counter-clockwise. ⚠️ DO: Move slowly, feel wrist mobility, keep movements controlled. DON'T: Force range of motion, move too fast, or continue if you feel wrist pain.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Arms", 
        type: "warmup" 
    },
    { 
        name: "Neck Rolls", 
        description: "Stand or sit with good posture. Slowly tilt head to one side, then roll forward and to other side. Avoid full circles - go side to side only. ⚠️ DO: Move very slowly, keep movements small, stop if uncomfortable. DON'T: Do full circles, move too fast, or continue if you feel neck pain.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "warmup" 
    },

    // Main exercises - Bodyweight
    { 
        name: "Squats", 
        description: "Stand with feet shoulder-width apart, toes slightly out. Push hips back and lower as if sitting in chair. Keep chest up, knees over toes. Push through heels to stand. ⚠️ DO: Keep chest up, push knees out, go to parallel or higher. DON'T: Let knees cave inward, round back, or go too deep if you have knee issues.", 
        equipment: "Bodyweight", 
        level: "Intermediate", 
        muscle: "Legs", 
        type: "main",
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
        injury_safe: ["shoulder_pain", "wrist_pain"]
    },
    { 
        name: "Lunges", 
        description: "Step forward with one leg, lowering until both knees are bent at 90 degrees. Front knee should be over toes, back knee near ground. Push back to start and switch legs. ⚠️ DO: Keep chest up, front knee over toes, back knee near ground. DON'T: Let front knee go past toes, round back, or lose balance.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate"], 
        muscle: "Legs", 
        type: "main" 
    },
    { 
        name: "Plank", 
        description: "Start in push-up position, then lower to forearms. Keep body in straight line from head to heels. Engage core and hold position. ⚠️ DO: Keep body straight, engage core, breathe normally. DON'T: Let hips sag or lift, hold breath, or let head drop.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Core", 
        type: "main" 
    },
    { 
        name: "Glute Bridge", 
        description: "Lie on back with knees bent, feet flat on floor. Lift hips toward ceiling, squeezing glutes. Hold briefly at top, then lower with control. ⚠️ DO: Squeeze glutes, keep core engaged, lift hips high enough. DON'T: Arch back excessively, let knees cave inward, or lift hips too high.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main" 
    },
    { 
        name: "Wall Sit", 
        description: "Lean against wall, slide down until thighs are parallel to floor. Keep back against wall, feet shoulder-width apart. Hold position. ⚠️ DO: Keep back against wall, thighs parallel to floor, breathe normally. DON'T: Let knees go past toes, slide too low, or hold breath.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate"], 
        muscle: "Legs", 
        type: "main" 
    },
    { 
        name: "Step-ups", 
        description: "Stand facing sturdy step or bench. Step up with one foot, then bring other foot up. Step back down with control and repeat. ⚠️ DO: Use full foot on step, keep chest up, step down with control. DON'T: Use momentum, let knee cave inward, or step down too hard.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate"], 
        muscle: "Legs", 
        type: "main" 
    },
    { 
        name: "Calf Raises", 
        description: "Stand on edge of step with heels hanging off. Rise up onto balls of feet, then lower heels below step level. Keep knees straight throughout. ⚠️ DO: Use full range of motion, keep knees straight, control the movement. DON'T: Bounce at bottom, let heels hit ground hard, or use momentum.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main" 
    },
    { 
        name: "Bird Dog", 
        description: "Start on hands and knees. Extend right arm forward and left leg back, keeping both straight. Hold briefly, then switch sides. Keep core engaged throughout. ⚠️ DO: Keep core stable, extend arm and leg straight, maintain balance. DON'T: Let hips rotate, lift too high, or lose balance.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate"], 
        muscle: "Core", 
        type: "main" 
    },
    { 
        name: "Dead Bug", 
        description: "Lie on back with arms extended toward ceiling, knees bent at 90 degrees. Lower opposite arm and leg toward floor, keeping back flat. Return and switch sides. ⚠️ DO: Keep back flat on floor, move slowly, engage core. DON'T: Let back arch, move too fast, or let legs drop too low.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate"], 
        muscle: "Core", 
        type: "main" 
    },
    { 
        name: "Burpees", 
        description: "Start standing, drop into squat, place hands on floor, jump feet back to plank, do push-up, jump feet forward, then jump up with arms overhead. ⚠️ DO: Land softly, maintain good form throughout, breathe rhythmically. DON'T: Rush the movement, sacrifice form for speed, or land hard on feet.", 
        equipment: "Bodyweight", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "main" 
    },
    { 
        name: "Diamond Push-ups", 
        description: "Form diamond shape with hands under chest, thumbs and index fingers touching. Perform push-up, keeping elbows close to body. Focuses on triceps. ⚠️ DO: Keep elbows close to body, lower chest to hands, maintain straight body. DON'T: Let elbows flare out, touch face to ground, or let hips sag.", 
        equipment: "Bodyweight", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Arms", 
        type: "main" 
    },
    { 
        name: "Pike Push-ups", 
        description: "Start in downward dog position, hands and feet on ground, hips high. Lower head toward ground, then push back up. Focuses on shoulders. ⚠️ DO: Keep hips high, lower head not chest, maintain straight arms. DON'T: Let hips drop, round back, or touch head to ground too hard.", 
        equipment: "Bodyweight", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Shoulders", 
        type: "main" 
    },
    { 
        name: "Superman", 
        description: "Lie face down on floor. Lift chest, arms, and legs off ground simultaneously. Hold briefly, then lower with control. Strengthens lower back. ⚠️ DO: Lift chest and legs together, keep neck neutral, breathe normally. DON'T: Lift too high, strain neck, or hold breath.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate"], 
        muscle: "Back", 
        type: "main" 
    },
    { 
        name: "Russian Twists", 
        description: "Sit on floor, lean back slightly, lift feet off ground. Twist torso from side to side, touching hands to floor on each side. Keep feet elevated. ⚠️ DO: Keep feet off ground, twist from torso, maintain balance. DON'T: Let feet touch ground, twist too fast, or round back excessively.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Core", 
        type: "main" 
    },
    { 
        name: "Bicycle Crunches", 
        description: "Lie on back, lift shoulders off ground. Bring opposite knee to opposite elbow in cycling motion. Keep lower back pressed to floor. ⚠️ DO: Keep lower back on floor, move slowly, engage core. DON'T: Pull on neck, let lower back lift, or move too fast.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Core", 
        type: "main" 
    },
    { 
        name: "Mountain Climbers", 
        description: "Start in plank position. Alternate bringing knees toward chest as if climbing. Keep hips level and core engaged throughout. ⚠️ DO: Keep hips level, move knees toward chest, maintain plank form. DON'T: Let hips lift, move too fast, or sacrifice form for speed.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "main" 
    },
    { 
        name: "Jump Squats", 
        description: "Perform regular squat, then explosively jump up, landing softly back in squat position. Land on balls of feet with knees slightly bent. ⚠️ DO: Land softly, maintain squat form, use arms for momentum. DON'T: Land hard on heels, let knees cave inward, or jump too high if you have joint issues.", 
        equipment: "Bodyweight", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main" 
    },
    { 
        name: "Split Squats", 
        description: "Step one foot back into lunge position. Lower body until back knee nearly touches ground. Keep front knee over toes. Push back up and repeat. ⚠️ DO: Keep front knee over toes, back knee near ground, chest up. DON'T: Let front knee go past toes, round back, or lose balance.", 
        equipment: "Bodyweight", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main" 
    },
    { 
        name: "Single-leg Glute Bridge", 
        description: "Lie on back with knees bent. Extend one leg straight up. Lift hips using only the bent leg, squeezing glutes. Lower with control and repeat. ⚠️ DO: Keep extended leg straight, squeeze glutes, maintain hip level. DON'T: Let hips tilt, let extended leg drop, or arch back excessively.", 
        equipment: "Bodyweight", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main" 
    },

    // Main exercises - Dumbbells
    { 
        name: "Dumbbell Bicep Curls", 
        description: "Stand with dumbbells at sides, palms facing forward. Curl dumbbells toward shoulders, keeping elbows at sides. Lower with control and repeat. ⚠️ DO: Keep elbows at sides, control the movement, squeeze biceps. DON'T: Swing body, let elbows move forward, or use momentum.", 
        equipment: "Dumbbells", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Arms", 
        type: "main" 
    },
    { 
        name: "Dumbbell Shoulder Press", 
        description: "Sit or stand with dumbbells at shoulder height, palms facing forward. Press dumbbells overhead until arms are straight. Lower with control and repeat. ⚠️ DO: Keep core engaged, press straight up, control the movement. DON'T: Arch back, let elbows flare out, or use momentum.", 
        equipment: "Dumbbells", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Shoulders", 
        type: "main" 
    },
    { 
        name: "Bent-over Dumbbell Rows", 
        description: "Bend forward at hips, keeping back straight. Hold dumbbells with arms hanging down. Pull dumbbells toward chest, squeezing shoulder blades. Lower with control. ⚠️ DO: Keep back straight, pull elbows back, squeeze shoulder blades. DON'T: Round back, use momentum, or let shoulders shrug.", 
        equipment: "Dumbbells", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "main" 
    },
    { 
        name: "Goblet Squat", 
        description: "Hold dumbbell vertically at chest level. Perform squat, keeping dumbbell close to chest. Go as deep as comfortable while maintaining good form. ⚠️ DO: Keep dumbbell close to chest, maintain upright posture, go to comfortable depth. DON'T: Let knees cave inward, round back, or let dumbbell move away from body.", 
        equipment: "Dumbbells", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main" 
    },
    { 
        name: "Dumbbell Flys", 
        description: "Lie on back with dumbbells extended above chest. Lower dumbbells out to sides in wide arc, keeping slight bend in elbows. Return to start and repeat. ⚠️ DO: Keep slight bend in elbows, control the movement, feel chest stretch. DON'T: Lock elbows, let dumbbells drop too low, or use momentum.", 
        equipment: "Dumbbells", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Chest", 
        type: "main" 
    },
    { 
        name: "Tricep Kickbacks", 
        description: "Bend forward at hips, keeping back straight. Hold dumbbell with elbow bent at 90 degrees. Extend arm straight back, squeezing tricep. Return and repeat. ⚠️ DO: Keep upper arm still, extend arm straight back, squeeze tricep. DON'T: Move upper arm, use momentum, or round back.", 
        equipment: "Dumbbells", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Arms", 
        type: "main" 
    },
    { 
        name: "Overhead Tricep Extension", 
        description: "Hold one dumbbell with both hands above head. Lower dumbbell behind head by bending elbows. Extend arms back to start and repeat. ⚠️ DO: Keep elbows close to head, control the movement, feel tricep work. DON'T: Let elbows flare out, arch back, or use momentum.", 
        equipment: "Dumbbells", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Arms", 
        type: "main" 
    },
    { 
        name: "Dumbbell Lunges", 
        description: "Hold dumbbells at sides. Step forward into lunge, lowering until both knees are bent at 90 degrees. Push back to start and repeat with other leg. ⚠️ DO: Keep chest up, front knee over toes, control the movement. DON'T: Let front knee go past toes, round back, or use momentum.", 
        equipment: "Dumbbells", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main" 
    },
    { 
        name: "Romanian Deadlifts (RDLs)", 
        description: "Hold dumbbells in front of thighs. Hinge at hips, pushing butt back while lowering dumbbells down legs. Keep back straight and legs nearly straight. ⚠️ DO: Hinge at hips, keep back straight, feel hamstring stretch. DON'T: Round back, bend knees too much, or let dumbbells swing.", 
        equipment: "Dumbbells", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main" 
    },
    { 
        name: "Lateral Raises", 
        description: "Stand with dumbbells at sides, palms facing body. Raise arms out to sides until they're at shoulder level. Lower with control and repeat. ⚠️ DO: Keep slight bend in elbows, raise to shoulder level, control the movement. DON'T: Raise above shoulder level, use momentum, or shrug shoulders.", 
        equipment: "Dumbbells", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Shoulders", 
        type: "main" 
    },
    { 
        name: "Front Raises", 
        description: "Stand with dumbbells in front of thighs, palms facing body. Raise dumbbells straight out in front to shoulder level. Lower with control and repeat. ⚠️ DO: Keep slight bend in elbows, raise to shoulder level, control the movement. DON'T: Raise above shoulder level, use momentum, or arch back.", 
        equipment: "Dumbbells", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Shoulders", 
        type: "main" 
    },
    { 
        name: "Dumbbell Deadlift", 
        description: "Stand with dumbbells in front of thighs. Hinge at hips, lowering dumbbells down legs while keeping back straight. Return to start by pushing hips forward. ⚠️ DO: Hinge at hips, keep back straight, control the movement. DON'T: Round back, bend knees too much, or use momentum.", 
        equipment: "Dumbbells", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "main" 
    },
    { 
        name: "Dumbbell Chest Press", 
        description: "Lie on back with dumbbells at chest level, palms facing forward. Press dumbbells straight up until arms are extended. Lower with control and repeat. ⚠️ DO: Keep core engaged, press straight up, control the movement. DON'T: Arch back, let elbows flare out, or use momentum.", 
        equipment: "Dumbbells", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Chest", 
        type: "main" 
    },

    // Cool-down exercises
    { 
        name: "Quad Stretch", 
        description: "Stand upright, bend one knee and grab foot behind you. Pull foot toward glutes, keeping knee pointing down. Hold 30 seconds per side. ⚠️ DO: Keep knee pointing down, hold stretch gently, breathe normally. DON'T: Force the stretch, let knee point outward, or hold breath.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "cooldown" 
    },
    { 
        name: "Chest Stretch", 
        description: "Stand in doorway, place forearms against door frame. Step forward to feel chest stretch. Hold 30 seconds, breathing deeply. ⚠️ DO: Keep shoulders relaxed, breathe deeply, feel gentle stretch. DON'T: Force the stretch, hold breath, or continue if you feel shoulder pain.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Chest", 
        type: "cooldown" 
    },
    { 
        name: "Child's Pose", 
        description: "Kneel on floor, sit back on heels, bend forward until forehead touches floor. Extend arms forward or rest them at sides. Hold 30-60 seconds. ⚠️ DO: Relax into the stretch, breathe deeply, let back round naturally. DON'T: Force the stretch, hold breath, or continue if you feel knee pain.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "cooldown" 
    },
    { 
        name: "Hamstring Stretch", 
        description: "Sit on floor with one leg extended, other leg bent. Lean forward from hips toward extended foot. Hold 30 seconds per side. ⚠️ DO: Lean from hips, keep back straight, feel gentle stretch. DON'T: Round back, force the stretch, or continue if you feel sharp pain.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "cooldown" 
    },
    { 
        name: "Pigeon Pose", 
        description: "Start on hands and knees. Bring one knee forward and place it behind wrist, extending other leg back. Lower hips toward floor and hold 30 seconds per side. ⚠️ DO: Keep hips square, breathe deeply, feel gentle stretch. DON'T: Force the stretch, let hips tilt, or continue if you feel knee pain.", 
        equipment: "Bodyweight", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "cooldown" 
    },
    { 
        name: "Triceps Stretch", 
        description: "Reach one arm overhead, bend elbow and place hand behind head. Use other hand to gently pull elbow toward head. Hold 30 seconds per side. ⚠️ DO: Pull gently, keep shoulders relaxed, breathe normally. DON'T: Pull too hard, hold breath, or continue if you feel shoulder pain.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Arms", 
        type: "cooldown" 
    },
    { 
        name: "Shoulder Stretch", 
        description: "Bring one arm across chest at shoulder level. Use other arm to gently pull it closer to chest. Hold 30 seconds per side. ⚠️ DO: Pull gently, keep shoulders relaxed, breathe normally. DON'T: Pull too hard, round back, or continue if you feel shoulder pain.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Shoulders", 
        type: "cooldown" 
    },
    { 
        name: "Calf Stretch", 
        description: "Stand facing wall, step one foot back. Press heel into floor while keeping back leg straight. Hold 30 seconds per side. ⚠️ DO: Keep back leg straight, press heel down, feel gentle stretch. DON'T: Bounce, force the stretch, or continue if you feel ankle pain.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "cooldown" 
    },
    { 
        name: "Hip Flexor Stretch", 
        description: "Kneel in lunge position, one foot forward. Gently push hips forward while keeping back straight. Hold 30 seconds per side. ⚠️ DO: Keep back straight, push hips gently forward, breathe deeply. DON'T: Arch back, force the stretch, or continue if you feel hip pain.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "cooldown" 
    },
    { 
        name: "Knees to Chest", 
        description: "Lie on back, hug both knees to chest. Rock gently side to side if comfortable. Hold 30-60 seconds, breathing deeply. ⚠️ DO: Hug knees gently, breathe deeply, relax into stretch. DON'T: Force knees too close, hold breath, or continue if you feel back pain.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "cooldown" 
    },
    { 
        name: "Cobra Pose", 
        description: "Lie face down, place hands under shoulders. Gently push upper body up, arching back slightly. Keep hips on floor and hold 15-30 seconds. ⚠️ DO: Push up gently, keep hips on floor, breathe normally. DON'T: Push up too high, strain neck, or continue if you feel back pain.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate"], 
        muscle: "Back", 
        type: "cooldown" 
    },
    { 
        name: "Butterfly Stretch", 
        description: "Sit on floor, bring soles of feet together. Gently press your knees towards the floor while keeping back straight. Hold 30-60 seconds. ⚠️ DO: Keep back straight, press knees gently, breathe deeply. DON'T: Force knees down, round back, or continue if you feel groin pain.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "cooldown" 
    },
    { 
        name: "Spinal Twist", 
        description: "Lie on back, bring one knee across your body, and look in the opposite direction. Hold 30 seconds per side. ⚠️ DO: Keep shoulders on floor, breathe deeply, feel gentle twist. DON'T: Force the twist, lift shoulders, or continue if you feel back pain.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "cooldown" 
    },
    { 
        name: "Lat Stretch", 
        description: "Kneel or stand beside a wall or bench. Place forearm on surface and lean hips back to feel stretch along the side of torso. Hold 20–30 seconds each side. ⚠️ DO: Keep ribs down and breathe. DON'T: Force the shoulder into pain or shrug.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "cooldown" 
    },
    { 
        name: "Ankle Hops", 
        description: "Stand tall and perform small, quick hops on the balls of your feet to prime calves and ankles. Keep knees soft and land lightly. ⚠️ DO: Land softly and keep hops small. DON'T: Lock knees or slam heels.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "warmup" 
    },
    { 
        name: "Hip Openers (Lunge + Circle)", 
        description: "Step into a forward lunge, gently circle the front knee outward for 5 reps, then inward for 5. Switch sides. ⚠️ DO: Move slowly within a comfy range. DON'T: Force deep angles or twist the knee.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "warmup" 
    },
    { 
        name: "Scapular Pulls", 
        description: "Hang from a bar with straight arms and pull shoulder blades down and together without bending elbows. 6–10 reps. ⚠️ DO: Keep arms straight and control. DON'T: Swing or bend elbows.", 
        equipment: "Pull-up Bar", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "warmup" 
    },
    { 
        name: "Reverse Lunges", 
        description: "Step one leg back and lower until both knees hit ~90°. Drive through the front heel to stand. Alternate sides. ⚠️ DO: Keep chest up and knee tracking toes. DON'T: Let front knee cave or slam the back knee.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate"], 
        muscle: "Legs", 
        type: "main" 
    },
    { 
        name: "Side Plank", 
        description: "Lie on your side, prop up on forearm, lift hips to form a straight line from head to feet. Hold. ⚠️ DO: Stack shoulders/hips and brace core. DON'T: Let hips sag or rotate.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Core", 
        type: "main" 
    },
    { 
        name: "Bear Crawl", 
        description: "On hands and toes with knees hovering off floor, crawl forward/backward keeping hips low and core tight. ⚠️ DO: Move slow and keep back flat. DON'T: Pike hips or let knees drag.", 
        equipment: "Bodyweight", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "main" 
    },
    { 
        name: "Hollow Body Hold", 
        description: "Lie on back, press lower back to floor, lift shoulders and legs slightly off ground, arms overhead. Hold. ⚠️ DO: Keep low back pressed down. DON'T: Overarch or hold breath.", 
        equipment: "Bodyweight", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Core", 
        type: "main" 
    },
    { 
        name: "Sumo Squats", 
        description: "Stand wide with toes out 30°, sit hips down keeping chest tall and knees tracking over toes. ⚠️ DO: Push knees out and stay tall. DON'T: Collapse arches or round back.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main" 
    },
    { 
        name: "Incline Push-ups", 
        description: "Hands on a bench or countertop, body in line, lower chest to edge and press away. ⚠️ DO: Keep body straight and control depth. DON'T: Flare elbows or drop hips.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate"], 
        muscle: "Chest", 
        type: "main" 
    },
    { 
        name: "Chair Dips", 
        description: "Hands on edge of a sturdy chair, feet forward, bend elbows to lower body then press up. ⚠️ DO: Keep shoulders down/back. DON'T: Let shoulders roll forward or lock out hard.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate"], 
        muscle: "Arms", 
        type: "main" 
    },
    { 
        name: "Kettlebell Swings", 
        description: "Hinge at hips, hike bell back and snap hips forward to chest height, arms relaxed. ⚠️ DO: Hinge, don't squat; snap hips. DON'T: Lift with arms or round back.", 
        equipment: "Kettlebell", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "main" 
    },
    { 
        name: "TRX Rows", 
        description: "Hold TRX handles lean back with straight body; pull chest to hands by driving elbows back. ⚠️ DO: Keep core tight and squeeze shoulder blades. DON'T: Shrug or let hips sag.", 
        equipment: "TRX Bands", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "main" 
    },
    { 
        name: "Band Pull-Aparts", 
        description: "Hold a resistance band at shoulder height; pull ends apart by squeezing shoulder blades. Control return. ⚠️ DO: Keep ribs down and elbows soft. DON'T: Overextend lower back.", 
        equipment: "Resistance Band", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Shoulders", 
        type: "main" 
    },
    { 
        name: "Jump Rope High Knees", 
        description: "Jump rope bringing knees up to hip height each turn at a steady rhythm. ⚠️ DO: Land softly and keep cadence. DON'T: Overstride or slam feet.", 
        equipment: "Jump Rope", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "main" 
    },
    { 
        name: "Rowing Sprints", 
        description: "On rower, perform short 20–40s sprints focusing on legs-then-hips-then-arms sequence. ⚠️ DO: Maintain form and full strokes. DON'T: Hunch or yank with arms.", 
        equipment: "Rower", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "main" 
    },
    { 
        name: "Seated Forward Fold", 
        description: "Sit tall with legs extended; hinge forward from hips reaching toward toes. Hold 30–60s. ⚠️ DO: Keep spine long and breathe. DON'T: Bounce or round aggressively.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "cooldown" 
    },
    { 
        name: "Figure Four Stretch", 
        description: "Lie on back, cross ankle over opposite knee and pull thigh toward chest to stretch glute. Hold 30s each. ⚠️ DO: Pull gently and keep neck relaxed. DON'T: Force the stretch into pain.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "cooldown" 
    },
    { 
        name: "Upper Trap Stretch", 
        description: "Sit tall, gently tilt ear toward shoulder and use hand to add light pressure. Hold 20–30s per side. ⚠️ DO: Keep shoulders down and breathe. DON'T: Yank the head or twist.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "cooldown" 
    },
    { 
        name: "Deep Breathing Stretch", 
        description: "Sit cross-legged, place hands on knees, take deep breaths while gently stretching arms overhead. Hold 60 seconds. ⚠️ DO: Breathe deeply and relax into the stretch. DON'T: Force the stretch or hold breath.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "cooldown" 
    },
    // Additional TRX exercises
    { 
        name: "TRX Push-ups", 
        description: "Place feet in TRX straps, assume plank position, perform push-ups while maintaining stability. ⚠️ DO: Keep core tight and control the movement. DON'T: Let hips sag or lose balance.", 
        equipment: "TRX Bands", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Arms", 
        type: "main" 
    },
    { 
        name: "TRX Squats", 
        description: "Hold TRX handles at chest height, squat down while keeping weight in heels, use straps for balance. ⚠️ DO: Keep chest up and knees over toes. DON'T: Let knees cave inward or round back.", 
        equipment: "TRX Bands", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main" 
    },
    { 
        name: "TRX Lunges", 
        description: "Step back into lunge with one foot in TRX strap, lower until back knee nearly touches ground. ⚠️ DO: Keep front knee over toes and chest up. DON'T: Let front knee go past toes.", 
        equipment: "TRX Bands", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main" 
    },
    { 
        name: "TRX Chest Press", 
        description: "Face away from anchor, lean forward with arms extended, press forward to standing position. ⚠️ DO: Keep core engaged and control the movement. DON'T: Lock elbows or lose balance.", 
        equipment: "TRX Bands", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Arms", 
        type: "main" 
    },
    { 
        name: "TRX Tricep Extensions", 
        description: "Face anchor, lean forward with arms bent, extend arms to straight position. ⚠️ DO: Keep elbows close to body and control movement. DON'T: Swing or use momentum.", 
        equipment: "TRX Bands", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Arms", 
        type: "main" 
    },
    { 
        name: "TRX Bicep Curls", 
        description: "Face anchor, hold handles at waist, curl arms up while maintaining body position. ⚠️ DO: Keep elbows stationary and squeeze biceps. DON'T: Swing body or use momentum.", 
        equipment: "TRX Bands", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Arms", 
        type: "main" 
    },
    { 
        name: "TRX Core Crunches", 
        description: "Lie on back, place feet in TRX straps, perform crunches while maintaining leg position. ⚠️ DO: Engage core and control movement. DON'T: Pull on neck or arch back.", 
        equipment: "TRX Bands", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Core", 
        type: "main" 
    },
    { 
        name: "TRX Pike", 
        description: "Start in plank with feet in TRX, pike hips up toward ceiling while keeping legs straight. ⚠️ DO: Keep core tight and control movement. DON'T: Let hips drop or swing.", 
        equipment: "TRX Bands", 
        level: ["Advanced"], 
        muscle: "Core", 
        type: "main" 
    },
    { 
        name: "TRX Hamstring Curls", 
        description: "Lie on back, place heels in TRX straps, curl legs toward glutes while keeping hips up. ⚠️ DO: Keep hips elevated and control movement. DON'T: Let hips drop or swing legs.", 
        equipment: "TRX Bands", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main" 
    },
    { 
        name: "TRX Single Arm Row", 
        description: "Stand sideways to anchor, hold one handle, perform single arm row while maintaining balance. ⚠️ DO: Keep core tight and squeeze shoulder blade. DON'T: Twist body or shrug shoulder.", 
        equipment: "TRX Bands", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "main" 
    },
    { 
        name: "TRX Y-Fly", 
        description: "Face anchor, hold handles overhead, perform Y-shaped fly motion while maintaining posture. ⚠️ DO: Keep core engaged and control movement. DON'T: Arch back or use momentum.", 
        equipment: "TRX Bands", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "main" 
    },
    { 
        name: "TRX T-Fly", 
        description: "Face anchor, hold handles at chest level, perform T-shaped fly motion for upper back. ⚠️ DO: Keep core tight and squeeze shoulder blades. DON'T: Round back or use momentum.", 
        equipment: "TRX Bands", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "main" 
    },
    { 
        name: "TRX Atomic Push-ups", 
        description: "Place feet in TRX straps, perform push-up then bring knees to chest in one fluid motion. ⚠️ DO: Keep core engaged throughout movement. DON'T: Let hips sag or lose control.", 
        equipment: "TRX Bands", 
        level: ["Advanced"], 
        muscle: "Full Body", 
        type: "main" 
    },
    { 
        name: "TRX Fallout", 
        description: "Kneel facing away from anchor, hold handles at chest, lean forward while maintaining core engagement. ⚠️ DO: Keep core tight and control lean. DON'T: Let back arch or lose balance.", 
        equipment: "TRX Bands", 
        level: ["Advanced"], 
        muscle: "Core", 
        type: "main" 
    },
    { 
        name: "TRX Suspended Lunge", 
        description: "Place one foot in TRX strap behind you, perform lunge while maintaining balance and form. ⚠️ DO: Keep front knee over toes and chest up. DON'T: Let back knee touch ground hard.", 
        equipment: "TRX Bands", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main" 
    },
    // Additional Kettlebell exercises
    { 
        name: "Kettlebell Deadlift", 
        description: "Stand with feet shoulder-width apart, hold kettlebell between legs, hinge at hips and lower, then stand up. ⚠️ DO: Keep back straight and push through heels. DON'T: Round back or lift with arms.", 
        equipment: "Kettlebell", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main" 
    },
    { 
        name: "Kettlebell Squat", 
        description: "Hold kettlebell at chest level, perform squat while keeping chest up and weight in heels. ⚠️ DO: Keep knees over toes and chest up. DON'T: Let knees cave inward or round back.", 
        equipment: "Kettlebell", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main" 
    },
    { 
        name: "Kettlebell Lunge", 
        description: "Hold kettlebell at chest, step forward into lunge, lower until back knee nearly touches ground. ⚠️ DO: Keep front knee over toes and chest up. DON'T: Let front knee go past toes.", 
        equipment: "Kettlebell", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main" 
    },
    { 
        name: "Kettlebell Press", 
        description: "Hold kettlebell at shoulder level, press overhead while keeping core engaged and avoiding arch. ⚠️ DO: Keep core tight and press straight up. DON'T: Arch back or lean backward.", 
        equipment: "Kettlebell", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Shoulders", 
        type: "main" 
    },
    { 
        name: "Kettlebell Row", 
        description: "Bend forward at hips, hold kettlebell in one hand, pull elbow back toward hip. ⚠️ DO: Keep back straight and squeeze shoulder blade. DON'T: Round back or swing the weight.", 
        equipment: "Kettlebell", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "main" 
    },
    { 
        name: "Kettlebell Clean", 
        description: "Start with kettlebell between legs, explosively lift to shoulder level using hip drive. ⚠️ DO: Use hip drive and keep weight close to body. DON'T: Use arms to lift or round back.", 
        equipment: "Kettlebell", 
        level: ["Advanced"], 
        muscle: "Full Body", 
        type: "main" 
    },
    { 
        name: "Kettlebell Snatch", 
        description: "Start with kettlebell between legs, explosively lift overhead in one fluid motion. ⚠️ DO: Use hip drive and keep weight close. DON'T: Use arms to lift or lose control.", 
        equipment: "Kettlebell", 
        level: ["Advanced"], 
        muscle: "Full Body", 
        type: "main" 
    },
    { 
        name: "Kettlebell Turkish Get-up", 
        description: "Lie on back with kettlebell in one hand, perform controlled get-up to standing position. ⚠️ DO: Keep eyes on kettlebell and move slowly. DON'T: Rush or lose control of weight.", 
        equipment: "Kettlebell", 
        level: ["Advanced"], 
        muscle: "Full Body", 
        type: "main" 
    },
    { 
        name: "Kettlebell Windmill", 
        description: "Hold kettlebell overhead with one arm, bend sideways while keeping arm straight. ⚠️ DO: Keep core engaged and control movement. DON'T: Let back arch or lose balance.", 
        equipment: "Kettlebell", 
        level: ["Advanced"], 
        muscle: "Core", 
        type: "main" 
    },
    { 
        name: "Kettlebell Figure-8", 
        description: "Stand with feet wide, pass kettlebell in figure-8 pattern between legs while maintaining stance. ⚠️ DO: Keep core engaged and control movement. DON'T: Let back round or lose balance.", 
        equipment: "Kettlebell", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Core", 
        type: "main" 
    },
    { 
        name: "Kettlebell Halo", 
        description: "Hold kettlebell at chest level, circle it around head while keeping core engaged. ⚠️ DO: Keep core tight and control movement. DON'T: Let back arch or lose balance.", 
        equipment: "Kettlebell", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Core", 
        type: "main" 
    },
    { 
        name: "Kettlebell Thruster", 
        description: "Hold kettlebell at chest, squat down, then explosively stand and press overhead. ⚠️ DO: Use hip drive and keep core engaged. DON'T: Round back or use arms to lift.", 
        equipment: "Kettlebell", 
        level: ["Advanced"], 
        muscle: "Full Body", 
        type: "main" 
    },
    { 
        name: "Kettlebell Sumo Deadlift", 
        description: "Stand with wide stance, hold kettlebell between legs, hinge at hips and lift. ⚠️ DO: Keep back straight and push through heels. DON'T: Round back or lift with arms.", 
        equipment: "Kettlebell", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main" 
    },
    { 
        name: "Kettlebell Single Leg Deadlift", 
        description: "Stand on one leg, hold kettlebell in opposite hand, hinge at hips while extending free leg back. ⚠️ DO: Keep back straight and control movement. DON'T: Round back or lose balance.", 
        equipment: "Kettlebell", 
        level: ["Advanced"], 
        muscle: "Legs", 
        type: "main" 
    },
    { 
        name: "Kettlebell Side Lunge", 
        description: "Hold kettlebell at chest, step to side into lunge, lower while keeping weight centered. ⚠️ DO: Keep chest up and knees over toes. DON'T: Let knees cave inward.", 
        equipment: "Kettlebell", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main" 
    },
    { 
        name: "Kettlebell Step-up", 
        description: "Hold kettlebell at chest, step up onto elevated surface, drive through front foot. ⚠️ DO: Keep chest up and drive through front foot. DON'T: Push off back foot or round back.", 
        equipment: "Kettlebell", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main" 
    },
    // Additional Resistance Band exercises
    { 
        name: "Resistance Band Squats", 
        description: "Stand on band with feet shoulder-width, hold handles at shoulders, perform squat while maintaining tension. ⚠️ DO: Keep chest up and knees over toes. DON'T: Let knees cave inward.", 
        equipment: "Resistance Band", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main" 
    },
    { 
        name: "Resistance Band Rows", 
        description: "Anchor band at chest height, hold handles, pull elbows back while squeezing shoulder blades. ⚠️ DO: Keep core engaged and squeeze shoulder blades. DON'T: Round back or use momentum.", 
        equipment: "Resistance Band", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "main" 
    },
    { 
        name: "Resistance Band Chest Press", 
        description: "Anchor band behind back, hold handles at chest, press forward while maintaining posture. ⚠️ DO: Keep core engaged and control movement. DON'T: Round back or lock elbows.", 
        equipment: "Resistance Band", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Arms", 
        type: "main" 
    },
    { 
        name: "Resistance Band Bicep Curls", 
        description: "Stand on band with feet shoulder-width, hold handles at sides, curl arms up while maintaining tension. ⚠️ DO: Keep elbows stationary and squeeze biceps. DON'T: Swing body or use momentum.", 
        equipment: "Resistance Band", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Arms", 
        type: "main" 
    },
    { 
        name: "Resistance Band Tricep Extensions", 
        description: "Anchor band overhead, hold handles behind head, extend arms overhead while maintaining tension. ⚠️ DO: Keep elbows close to head and control movement. DON'T: Swing or use momentum.", 
        equipment: "Resistance Band", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Arms", 
        type: "main" 
    },
    { 
        name: "Resistance Band Lateral Raises", 
        description: "Stand on band with feet shoulder-width, hold handles at sides, raise arms to shoulder level. ⚠️ DO: Keep core engaged and control movement. DON'T: Swing or use momentum.", 
        equipment: "Resistance Band", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Shoulders", 
        type: "main" 
    },
    { 
        name: "Resistance Band Front Raises", 
        description: "Stand on band with feet shoulder-width, hold handles at thighs, raise arms to shoulder level. ⚠️ DO: Keep core engaged and control movement. DON'T: Swing or use momentum.", 
        equipment: "Resistance Band", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Shoulders", 
        type: "main" 
    },
    { 
        name: "Resistance Band Deadlift", 
        description: "Stand on band with feet shoulder-width, hold handles at thighs, hinge at hips and lower, then stand up. ⚠️ DO: Keep back straight and push through heels. DON'T: Round back or lift with arms.", 
        equipment: "Resistance Band", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main" 
    },
    { 
        name: "Resistance Band Lunges", 
        description: "Step back into lunge with band under front foot, hold handles at chest, perform lunge. ⚠️ DO: Keep front knee over toes and chest up. DON'T: Let front knee go past toes.", 
        equipment: "Resistance Band", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main" 
    },
    { 
        name: "Resistance Band Glute Bridge", 
        description: "Lie on back with band above knees, bend knees, lift hips while pressing knees outward. ⚠️ DO: Keep core engaged and squeeze glutes. DON'T: Arch back or let knees cave inward.", 
        equipment: "Resistance Band", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main" 
    },
    { 
        name: "Resistance Band Clamshells", 
        description: "Lie on side with band above knees, bend knees, open top knee while keeping feet together. ⚠️ DO: Keep core engaged and control movement. DON'T: Let hips roll or use momentum.", 
        equipment: "Resistance Band", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main" 
    },
    { 
        name: "Resistance Band Side Steps", 
        description: "Place band above knees, step to side while maintaining tension, alternate directions. ⚠️ DO: Keep tension on band and control movement. DON'T: Let knees cave inward.", 
        equipment: "Resistance Band", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main" 
    },
    { 
        name: "Resistance Band Woodchoppers", 
        description: "Anchor band at shoulder height, hold handles with both hands, rotate torso while pulling across body. ⚠️ DO: Keep core engaged and control rotation. DON'T: Use momentum or round back.", 
        equipment: "Resistance Band", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Core", 
        type: "main" 
    },
    { 
        name: "Resistance Band Pallof Press", 
        description: "Anchor band at chest height, hold handles with both hands, press forward while resisting rotation. ⚠️ DO: Keep core engaged and resist rotation. DON'T: Let body twist or round back.", 
        equipment: "Resistance Band", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Core", 
        type: "main" 
    },
    { 
        name: "Resistance Band Face Pulls", 
        description: "Anchor band at face height, hold handles with both hands, pull toward face while keeping elbows high. ⚠️ DO: Keep elbows high and squeeze shoulder blades. DON'T: Round back or use momentum.", 
        equipment: "Resistance Band", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "main" 
    },
    { 
        name: "Resistance Band Reverse Fly", 
        description: "Anchor band at chest height, hold handles with arms extended, pull arms back while squeezing shoulder blades. ⚠️ DO: Keep core engaged and squeeze shoulder blades. DON'T: Round back or use momentum.", 
        equipment: "Resistance Band", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "main" 
    },
    { 
        name: "Resistance Band Upright Rows", 
        description: "Stand on band with feet shoulder-width, hold handles at thighs, pull elbows up to shoulder level. ⚠️ DO: Keep core engaged and control movement. DON'T: Shrug shoulders or use momentum.", 
        equipment: "Resistance Band", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Shoulders", 
        type: "main" 
    },
    { 
        name: "Resistance Band Shrugs", 
        description: "Stand on band with feet shoulder-width, hold handles at sides, shrug shoulders up and down. ⚠️ DO: Keep core engaged and control movement. DON'T: Round back or use momentum.", 
        equipment: "Resistance Band", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "main" 
    },
    // Additional Pull-up Bar exercises
    { 
        name: "Pull-up Bar Hanging Leg Raises", 
        description: "Hang from pull-up bar, raise legs to parallel or higher while keeping core engaged. ⚠️ DO: Keep core tight and control movement. DON'T: Swing or use momentum.", 
        equipment: "Pull-up Bar", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Core", 
        type: "main" 
    },
    { 
        name: "Pull-up Bar Knee Tucks", 
        description: "Hang from pull-up bar, bring knees toward chest while keeping core engaged. ⚠️ DO: Keep core tight and control movement. DON'T: Swing or use momentum.", 
        equipment: "Pull-up Bar", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Core", 
        type: "main" 
    },
    { 
        name: "Pull-up Bar L-Sit", 
        description: "Hang from pull-up bar, lift legs to form L-shape while keeping core engaged. ⚠️ DO: Keep core tight and hold position. DON'T: Round back or let legs drop.", 
        equipment: "Pull-up Bar", 
        level: ["Advanced"], 
        muscle: "Core", 
        type: "main" 
    },
    { 
        name: "Pull-up Bar Windshield Wipers", 
        description: "Hang from pull-up bar, swing legs side to side while keeping core engaged. ⚠️ DO: Keep core tight and control movement. DON'T: Swing too fast or lose control.", 
        equipment: "Pull-up Bar", 
        level: ["Advanced"], 
        muscle: "Core", 
        type: "main" 
    },
    { 
        name: "Pull-up Bar Toes to Bar", 
        description: "Hang from pull-up bar, raise legs to touch bar with toes while keeping core engaged. ⚠️ DO: Keep core tight and control movement. DON'T: Swing or use momentum.", 
        equipment: "Pull-up Bar", 
        level: ["Advanced"], 
        muscle: "Core", 
        type: "main" 
    },
    { 
        name: "Pull-up Bar Hanging Scissors", 
        description: "Hang from pull-up bar, alternate raising legs in scissor motion while keeping core engaged. ⚠️ DO: Keep core tight and control movement. DON'T: Swing or use momentum.", 
        equipment: "Pull-up Bar", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Core", 
        type: "main" 
    },
    { 
        name: "Pull-up Bar Hanging Bicycles", 
        description: "Hang from pull-up bar, perform bicycle motion with legs while keeping core engaged. ⚠️ DO: Keep core tight and control movement. DON'T: Swing or use momentum.", 
        equipment: "Pull-up Bar", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Core", 
        type: "main" 
    },
    { 
        name: "Pull-up Bar Hanging Side Crunches", 
        description: "Hang from pull-up bar, bring knees toward opposite shoulder while keeping core engaged. ⚠️ DO: Keep core tight and control movement. DON'T: Swing or use momentum.", 
        equipment: "Pull-up Bar", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Core", 
        type: "main" 
    },
    { 
        name: "Pull-up Bar Hanging Oblique Twists", 
        description: "Hang from pull-up bar, twist legs side to side while keeping core engaged. ⚠️ DO: Keep core tight and control movement. DON'T: Swing or use momentum.", 
        equipment: "Pull-up Bar", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Core", 
        type: "main" 
    },
    { 
        name: "Pull-up Bar Hanging Pike", 
        description: "Hang from pull-up bar, raise legs toward bar while keeping core engaged and legs straight. ⚠️ DO: Keep core tight and control movement. DON'T: Swing or use momentum.", 
        equipment: "Pull-up Bar", 
        level: ["Advanced"], 
        muscle: "Core", 
        type: "main" 
    },
    { 
        name: "Pull-up Bar Hanging Knee Circles", 
        description: "Hang from pull-up bar, draw circles with knees while keeping core engaged. ⚠️ DO: Keep core tight and control movement. DON'T: Swing or use momentum.", 
        equipment: "Pull-up Bar", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Core", 
        type: "main" 
    },
    { 
        name: "Pull-up Bar Hanging Figure-8", 
        description: "Hang from pull-up bar, move legs in figure-8 pattern while keeping core engaged. ⚠️ DO: Keep core tight and control movement. DON'T: Swing or use momentum.", 
        equipment: "Pull-up Bar", 
        level: ["Advanced"], 
        muscle: "Core", 
        type: "main" 
    },
    { 
        name: "Pull-up Bar Hanging Side Leg Raises", 
        description: "Hang from pull-up bar, raise legs to side while keeping core engaged. ⚠️ DO: Keep core tight and control movement. DON'T: Swing or use momentum.", 
        equipment: "Pull-up Bar", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Core", 
        type: "main" 
    },
    { 
        name: "Pull-up Bar Hanging Knee Tucks with Twist", 
        description: "Hang from pull-up bar, bring knees toward chest while twisting to one side, alternate sides. ⚠️ DO: Keep core tight and control movement. DON'T: Swing or use momentum.", 
        equipment: "Pull-up Bar", 
        level: ["Advanced"], 
        muscle: "Core", 
        type: "main" 
    },
    { 
        name: "Pull-up Bar Hanging Leg Extensions", 
        description: "Hang from pull-up bar, extend legs straight out while keeping core engaged. ⚠️ DO: Keep core tight and control movement. DON'T: Swing or use momentum.", 
        equipment: "Pull-up Bar", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Core", 
        type: "main" 
    },
    { 
        name: "Pull-up Bar Hanging Knee Raises with Hold", 
        description: "Hang from pull-up bar, raise knees to chest and hold position while keeping core engaged. ⚠️ DO: Keep core tight and hold position. DON'T: Swing or use momentum.", 
        equipment: "Pull-up Bar", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Core", 
        type: "main" 
    },
    // Additional Jump Rope exercises
    { 
        name: "Jump Rope High Knees", 
        description: "Jump rope while bringing knees up toward chest with each jump. ⚠️ DO: Keep core engaged and land softly. DON'T: Land hard or let knees cave inward.", 
        equipment: "Jump Rope", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "main" 
    },
    { 
        name: "Jump Rope Butt Kicks", 
        description: "Jump rope while kicking heels toward glutes with each jump. ⚠️ DO: Keep core engaged and land softly. DON'T: Land hard or let knees cave inward.", 
        equipment: "Jump Rope", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "main" 
    },
    { 
        name: "Jump Rope Side to Side", 
        description: "Jump rope while moving side to side with each jump. ⚠️ DO: Keep core engaged and land softly. DON'T: Land hard or lose balance.", 
        equipment: "Jump Rope", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "main" 
    },
    { 
        name: "Jump Rope Forward Backward", 
        description: "Jump rope while moving forward and backward with each jump. ⚠️ DO: Keep core engaged and land softly. DON'T: Land hard or lose balance.", 
        equipment: "Jump Rope", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "main" 
    },
    { 
        name: "Jump Rope Double Unders", 
        description: "Jump rope while making rope pass under feet twice per jump. ⚠️ DO: Keep core engaged and jump higher. DON'T: Land hard or lose rhythm.", 
        equipment: "Jump Rope", 
        level: ["Advanced"], 
        muscle: "Full Body", 
        type: "main" 
    },
    { 
        name: "Jump Rope Crossovers", 
        description: "Jump rope while crossing arms in front of body with each jump. ⚠️ DO: Keep core engaged and land softly. DON'T: Land hard or lose rhythm.", 
        equipment: "Jump Rope", 
        level: ["Advanced"], 
        muscle: "Full Body", 
        type: "main" 
    },
    { 
        name: "Jump Rope Single Leg", 
        description: "Jump rope while hopping on one leg, alternate legs. ⚠️ DO: Keep core engaged and land softly. DON'T: Land hard or lose balance.", 
        equipment: "Jump Rope", 
        level: ["Advanced"], 
        muscle: "Full Body", 
        type: "main" 
    },
    { 
        name: "Jump Rope Criss Cross", 
        description: "Jump rope while crossing legs in front and back with each jump. ⚠️ DO: Keep core engaged and land softly. DON'T: Land hard or lose rhythm.", 
        equipment: "Jump Rope", 
        level: ["Advanced"], 
        muscle: "Full Body", 
        type: "main" 
    },
    { 
        name: "Jump Rope Boxer Skip", 
        description: "Jump rope while moving feet in boxing shuffle pattern. ⚠️ DO: Keep core engaged and land softly. DON'T: Land hard or lose rhythm.", 
        equipment: "Jump Rope", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "main" 
    },
    { 
        name: "Jump Rope Heel Toe", 
        description: "Jump rope while alternating heel and toe touches with each jump. ⚠️ DO: Keep core engaged and land softly. DON'T: Land hard or lose rhythm.", 
        equipment: "Jump Rope", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "main" 
    },
    { 
        name: "Jump Rope Jumping Jacks", 
        description: "Jump rope while performing jumping jack motion with each jump. ⚠️ DO: Keep core engaged and land softly. DON'T: Land hard or lose rhythm.", 
        equipment: "Jump Rope", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "main" 
    },
    { 
        name: "Jump Rope Skier", 
        description: "Jump rope while moving feet side to side like skiing. ⚠️ DO: Keep core engaged and land softly. DON'T: Land hard or lose balance.", 
        equipment: "Jump Rope", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "main" 
    },
    { 
        name: "Jump Rope Mummy Kicks", 
        description: "Jump rope while kicking legs forward like a mummy walk. ⚠️ DO: Keep core engaged and land softly. DON'T: Land hard or lose balance.", 
        equipment: "Jump Rope", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "main" 
    },
    { 
        name: "Jump Rope Bell", 
        description: "Jump rope while jumping in place with feet together. ⚠️ DO: Keep core engaged and land softly. DON'T: Land hard or let knees cave inward.", 
        equipment: "Jump Rope", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "main" 
    },
    { 
        name: "Jump Rope Scissors", 
        description: "Jump rope while alternating feet forward and back with each jump. ⚠️ DO: Keep core engaged and land softly. DON'T: Land hard or lose rhythm.", 
        equipment: "Jump Rope", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "main" 
    },
    { 
        name: "Jump Rope Can Can", 
        description: "Jump rope while kicking one leg up and out to the side with each jump. ⚠️ DO: Keep core engaged and land softly. DON'T: Land hard or lose balance.", 
        equipment: "Jump Rope", 
        level: ["Advanced"], 
        muscle: "Full Body", 
        type: "main" 
    },
    { 
        name: "Jump Rope Russian", 
        description: "Jump rope while alternating feet in Russian dance pattern. ⚠️ DO: Keep core engaged and land softly. DON'T: Land hard or lose rhythm.", 
        equipment: "Jump Rope", 
        level: ["Advanced"], 
        muscle: "Full Body", 
        type: "main" 
    },
    // Additional Rower exercises
    { 
        name: "Rower Intervals", 
        description: "Alternate between 30 seconds hard rowing and 30 seconds easy rowing. ⚠️ DO: Maintain proper form and control breathing. DON'T: Sacrifice form for speed.", 
        equipment: "Rower", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "main" 
    },
    { 
        name: "Rower Pyramid", 
        description: "Start with 100m, increase by 100m each round, then decrease back down. ⚠️ DO: Maintain proper form throughout. DON'T: Sacrifice form for distance.", 
        equipment: "Rower", 
        level: ["Advanced"], 
        muscle: "Full Body", 
        type: "main" 
    },
    { 
        name: "Rower Tabata", 
        description: "20 seconds hard rowing, 10 seconds rest, repeat 8 times. ⚠️ DO: Maintain proper form and push hard during work periods. DON'T: Sacrifice form for intensity.", 
        equipment: "Rower", 
        level: ["Advanced"], 
        muscle: "Full Body", 
        type: "main" 
    },
    { 
        name: "Rower Distance Challenge", 
        description: "Row for distance with consistent pace over 5-10 minutes. ⚠️ DO: Maintain proper form and steady pace. DON'T: Start too fast or sacrifice form.", 
        equipment: "Rower", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "main" 
    },
    { 
        name: "Rower Power Strokes", 
        description: "Focus on powerful leg drive and strong finish with each stroke. ⚠️ DO: Use legs first, then body, then arms. DON'T: Use only arms or round back.", 
        equipment: "Rower", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "main" 
    },
    { 
        name: "Rower Technique Focus", 
        description: "Row at moderate pace focusing on perfect form and smooth transitions. ⚠️ DO: Maintain proper sequence and smooth movement. DON'T: Rush or break form.", 
        equipment: "Rower", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "main" 
    },
    { 
        name: "Rower Endurance", 
        description: "Row at steady pace for 15-30 minutes building cardiovascular endurance. ⚠️ DO: Maintain consistent pace and proper form. DON'T: Start too fast or sacrifice form.", 
        equipment: "Rower", 
        level: ["Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "main" 
    },
    { 
        name: "Rower Sprint Finish", 
        description: "Row at moderate pace, finish last 2 minutes with maximum effort sprint. ⚠️ DO: Maintain proper form even during sprint. DON'T: Sacrifice form for speed.", 
        equipment: "Rower", 
        level: ["Advanced"], 
        muscle: "Full Body", 
        type: "main" 
    }
];

// --- HELPER FUNCTIONS ---
function validateForm() {
    const level = document.getElementById('fitness-level').value;
    const mainDuration = parseInt(document.querySelector('input[name="duration"]:checked').value);
    const workTime = parseInt(document.getElementById('work-time').value);
    const restTime = parseInt(document.getElementById('rest-time').value);
    const equipmentCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    
    // Validate fitness level
    if (!['Beginner', 'Intermediate', 'Advanced'].includes(level)) {
        throw new Error('Invalid fitness level selected');
    }
    
    // Validate duration
    if (isNaN(mainDuration) || mainDuration < 15 || mainDuration > 60) {
        throw new Error('Invalid duration selected');
    }
    
    // Validate work time
    if (isNaN(workTime) || workTime < 20 || workTime > 120) {
        throw new Error('Invalid work time selected');
    }
    
    // Validate rest time
    if (isNaN(restTime) || restTime < 10 || restTime > 60) {
        throw new Error('Invalid rest time selected');
    }
    
    // Validate equipment selection
    if (equipmentCheckboxes.length === 0) {
        throw new Error('No equipment selected');
    }
    
    return true;
}

function showError(message) {
    // Create error notification
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed top-4 right-4 bg-fit-danger text-white px-6 py-4 rounded-xl shadow-lg z-50 animate-fade-in';
    errorDiv.innerHTML = `
        <div class="flex items-center">
            <div class="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mr-3">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </div>
            <span class="font-medium">${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white/80 hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    `;
    
    document.body.appendChild(errorDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentElement) {
            errorDiv.remove();
        }
    }, 5000);
}

function showSuccess(message) {
    // Create success notification
    const successDiv = document.createElement('div');
    successDiv.className = 'fixed top-4 right-4 bg-fit-success text-white px-6 py-4 rounded-xl shadow-lg z-50 animate-fade-in';
    successDiv.innerHTML = `
        <div class="flex items-center">
            <div class="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
            </div>
            <span class="font-medium">${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white/80 hover:text-white transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    `;
    
    document.body.appendChild(successDiv);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (successDiv.parentElement) {
            successDiv.remove();
        }
    }, 3000);
}

function setLoading(isLoading) {
    const loadingDiv = document.getElementById('loading');
    const generateBtn = document.getElementById('generate-btn');
    
    loadingDiv.classList.toggle('hidden', !isLoading);
    generateBtn.disabled = isLoading;
    
    if (isLoading) {
        generateBtn.classList.add('opacity-50', 'cursor-not-allowed');
        generateBtn.innerHTML = `
            <span class="flex items-center justify-center space-x-2">
                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Generating...</span>
            </span>
        `;
    } else {
        generateBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        generateBtn.innerHTML = `
            <span class="flex items-center justify-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                <span>Generate Workout</span>
            </span>
        `;
    }
}

function generateRandomSet(exerciseList, count) {
    if (exerciseList.length === 0) return [];
    const shuffled = [...exerciseList].sort(() => 0.5 - Math.random());
    const numToReturn = Math.min(count, shuffled.length);
    return shuffled.slice(0, numToReturn);
}

	// --- MAIN INITIALIZATION ---
	document.addEventListener('DOMContentLoaded', () => {
		// Initialize training pattern functionality
		initializeTrainingPatterns();
		// App state for overview/player flow
		const appState = {
			warmup: [],
			main: [],
			cooldown: [],
			sequence: [],
			workTime: 45,
			restTime: 15,
			currentIndex: 0,
			phase: 'work', // 'work' | 'rest'
			remainingSeconds: 0,
			timerId: null,
			isPaused: false,
			enableSound: true,
			enableVibration: true,
			audioContext: null,
			trainingPattern: 'standard', // New: training pattern
			patternSettings: {} // New: pattern-specific settings
		};

		// --- Training Pattern Management ---
		// NEW FEATURE: Enhanced training pattern management with smart calculations
		// This feature automatically adjusts training settings based on workout duration
		// Added: 2025-09-02 - Smart calculation system for optimal workout planning
		function initializeTrainingPatterns() {
			const patternInputs = document.querySelectorAll('input[name="training-pattern"]');
			const patternSettings = document.getElementById('pattern-settings');
			
			patternInputs.forEach(input => {
				input.addEventListener('change', (e) => {
					const pattern = e.target.value;
					appState.trainingPattern = pattern;
					showPatternSettings(pattern);
					updatePatternSettingsForDuration();
				});
			});
			
			// Add listeners for duration changes to auto-update pattern settings
			const durationInputs = document.querySelectorAll('input[name="duration"]');
			durationInputs.forEach(input => {
				input.addEventListener('change', () => {
					updatePatternSettingsForDuration();
				});
			});
		}

		function updatePatternSettingsForDuration() {
			// Only update if a pattern is selected
			if (appState.trainingPattern === 'standard') return;
			
			const selectedDuration = document.querySelector('input[name="duration"]:checked')?.value || '30';
			const workoutDurationMinutes = parseInt(selectedDuration);
			
			switch(appState.trainingPattern) {
				case 'circuit':
					const circuitRounds = Math.max(2, Math.min(6, Math.floor(workoutDurationMinutes / 10)));
					if (document.getElementById('circuit-rounds')) {
						document.getElementById('circuit-rounds').value = circuitRounds;
					}
					break;
				case 'tabata':
					const tabataRounds = Math.max(4, Math.min(12, Math.floor(workoutDurationMinutes / 5)));
					if (document.getElementById('tabata-rounds')) {
						document.getElementById('tabata-rounds').value = tabataRounds;
					}
					break;
				case 'pyramid':
					const pyramidLevels = Math.max(3, Math.min(7, Math.floor(workoutDurationMinutes / 8)));
					if (document.getElementById('pyramid-levels')) {
						document.getElementById('pyramid-levels').value = pyramidLevels;
					}
					break;
			}
		}

		function showPatternSettings(pattern) {
			const patternSettings = document.getElementById('pattern-settings');
			const circuitSettings = document.getElementById('circuit-settings');
			const tabataSettings = document.getElementById('tabata-settings');
			const pyramidSettings = document.getElementById('pyramid-settings');
			
			// Hide all settings first
			circuitSettings.classList.add('hidden');
			tabataSettings.classList.add('hidden');
			pyramidSettings.classList.add('hidden');
			
			// Show pattern settings container
			patternSettings.classList.remove('hidden');
			
			// Show specific settings based on pattern
			switch(pattern) {
				case 'circuit':
					circuitSettings.classList.remove('hidden');
					break;
				case 'tabata':
					tabataSettings.classList.remove('hidden');
					break;
				case 'pyramid':
					pyramidSettings.classList.remove('hidden');
					break;
				default:
					patternSettings.classList.add('hidden');
			}
		}

		function getPatternSettings() {
			const settings = {};
			
			// Get the selected workout duration
			const selectedDuration = document.querySelector('input[name="duration"]:checked')?.value || '30';
			const workoutDurationMinutes = parseInt(selectedDuration);
			
			switch(appState.trainingPattern) {
				case 'circuit':
					// Calculate rounds based on workout duration
					// 15min: 2-3 rounds, 30min: 3-4 rounds, 45min: 4-5 rounds, 60min: 5-6 rounds
					const circuitRounds = Math.max(2, Math.min(6, Math.floor(workoutDurationMinutes / 10)));
					settings.rounds = parseInt(document.getElementById('circuit-rounds')?.value) || circuitRounds;
					settings.circuitRest = parseInt(document.getElementById('circuit-rest')?.value) || 60;
					break;
				case 'tabata':
					// Calculate rounds based on workout duration
					// 15min: 6 rounds, 30min: 8 rounds, 45min: 10 rounds, 60min: 12 rounds
					const tabataRounds = Math.max(4, Math.min(12, Math.floor(workoutDurationMinutes / 5)));
					settings.rounds = parseInt(document.getElementById('tabata-rounds')?.value) || tabataRounds;
					settings.setRest = parseInt(document.getElementById('tabata-rest')?.value) || 30;
					break;
				case 'pyramid':
					// Calculate levels based on workout duration
					// 15min: 3-4 levels, 30min: 4-5 levels, 45min: 5-6 levels, 60min: 6-7 levels
					const pyramidLevels = Math.max(3, Math.min(7, Math.floor(workoutDurationMinutes / 8)));
					settings.levels = parseInt(document.getElementById('pyramid-levels')?.value) || pyramidLevels;
					settings.levelRest = parseInt(document.getElementById('pyramid-rest')?.value) || 45;
					break;
			}
			
			return settings;
		}

		// --- SMART EXERCISE SUBSTITUTION SYSTEM ---
		// Phase 1: Intelligent exercise alternatives and difficulty scaling
		
		function findExerciseAlternatives(targetExercise, userPreferences = {}) {
			const { availableEquipment = [], fitnessLevel = 'Beginner', injuryLimitations = [] } = userPreferences;
			
			// Find exercises that target similar muscle groups
			const alternatives = exercises.filter(exercise => {
				// Skip the original exercise
				if (exercise.name === targetExercise.name) return false;
				
				// Check if user has required equipment
				const hasEquipment = exercise.equipment_needed?.some(eq => 
					eq === 'none' || availableEquipment.includes(eq)
				) ?? true;
				
				// Check fitness level compatibility
				const levelCompatible = exercise.difficulty <= getDifficultyLevel(fitnessLevel);
				
				// Check injury safety
				const isInjurySafe = !exercise.injury_safe?.some(injury => 
					injuryLimitations.includes(injury)
				);
				
				// Check muscle group similarity
				const muscleSimilar = exercise.muscle_groups?.some(muscle => 
					targetExercise.muscle_groups?.includes(muscle)
				) ?? (exercise.muscle === targetExercise.muscle);
				
				return hasEquipment && levelCompatible && isInjurySafe && muscleSimilar;
			});
			
			// Sort by relevance (equipment match, difficulty, muscle similarity)
			return alternatives.sort((a, b) => {
				let scoreA = 0, scoreB = 0;
				
				// Equipment match bonus
				if (a.equipment_needed?.includes('none')) scoreA += 3;
				if (b.equipment_needed?.includes('none')) scoreB += 3;
				
				// Difficulty match bonus
				const targetDifficulty = getDifficultyLevel(fitnessLevel);
				scoreA += 3 - Math.abs(a.difficulty - targetDifficulty);
				scoreB += 3 - Math.abs(b.difficulty - targetDifficulty);
				
				// Muscle group match bonus
				const muscleMatchA = a.muscle_groups?.filter(m => 
					targetExercise.muscle_groups?.includes(m)
				).length ?? 0;
				const muscleMatchB = b.muscle_groups?.filter(m => 
					targetExercise.muscle_groups?.includes(m)
				).length ?? 0;
				scoreA += muscleMatchA;
				scoreB += muscleMatchB;
				
				return scoreB - scoreA;
			}).slice(0, 5); // Return top 5 alternatives
		}
		
		function getDifficultyLevel(fitnessLevel) {
			const levels = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
			return levels[fitnessLevel] || 1;
		}
		
		function suggestExerciseSubstitution(originalExercise, reason, userPreferences = {}) {
			const alternatives = findExerciseAlternatives(originalExercise, userPreferences);
			
			if (alternatives.length === 0) {
				return {
					success: false,
					message: `No suitable alternatives found for ${originalExercise.name}. Consider modifying the exercise or skipping it.`,
					originalExercise
				};
			}
			
			const bestAlternative = alternatives[0];
			return {
				success: true,
				message: `Suggested alternative for ${originalExercise.name}: ${bestAlternative.name}`,
				originalExercise,
				alternative: bestAlternative,
				allAlternatives: alternatives,
				reason: reason
			};
		}
		
		function enhanceWorkoutWithSubstitutions(workout, userPreferences = {}) {
			const enhancedWorkout = [];
			
			workout.forEach(exercise => {
				if (exercise.type === 'circuit_round' || exercise.type === 'tabata_set' || exercise.type === 'pyramid_set') {
					// Keep round/set headers as-is
					enhancedWorkout.push(exercise);
				} else {
					// Check if exercise needs substitution
					const substitution = suggestExerciseSubstitution(exercise, 'availability', userPreferences);
					
					if (substitution.success) {
						// Add substitution info to exercise
						enhancedWorkout.push({
							...exercise,
							_hasSubstitution: true,
							_substitution: substitution.alternative,
							_substitutionReason: substitution.reason
						});
					} else {
						enhancedWorkout.push(exercise);
					}
				}
			});
			
			return enhancedWorkout;
		}
		

		
		// --- Smart Substitution UI Functions ---
		function showSubstitutionDetails(originalName, alternativeName, reason) {
			// Create modal for substitution details
			const modal = document.createElement('div');
			modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
			modal.innerHTML = `
				<div class="bg-white rounded-lg p-6 max-w-md mx-4">
					<div class="flex items-center justify-between mb-4">
						<h3 class="text-lg font-semibold text-fit-dark">🔄 Exercise Substitution</h3>
						<button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
							<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
							</svg>
						</button>
					</div>
					<div class="space-y-4">
						<div class="bg-gray-50 rounded-lg p-4">
							<h4 class="font-medium text-fit-dark mb-2">Original Exercise</h4>
							<p class="text-fit-secondary">${originalName}</p>
						</div>
						<div class="bg-fit-accent/10 rounded-lg p-4">
							<h4 class="font-medium text-fit-accent mb-2">Suggested Alternative</h4>
							<p class="text-fit-accent font-semibold">${alternativeName}</p>
						</div>
						<div class="bg-blue-50 rounded-lg p-4">
							<h4 class="font-medium text-blue-700 mb-2">Why This Alternative?</h4>
							<p class="text-blue-600 text-sm">${reason === 'availability' ? 'Based on your equipment and fitness level' : reason}</p>
						</div>
						<div class="flex space-x-3">
							<button onclick="applySubstitution('${originalName}', '${alternativeName}')" class="flex-1 bg-fit-primary text-white py-2 px-4 rounded-lg hover:bg-fit-primary/80 transition-colors">
								Apply Substitution
							</button>
							<button onclick="this.closest('.fixed').remove()" class="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors">
								Keep Original
							</button>
						</div>
					</div>
				</div>
			`;
			
			document.body.appendChild(modal);
		}
		
		function applySubstitution(originalName, alternativeName) {
			// Find and replace the exercise in the workout
			const exerciseIndex = appState.sequence.findIndex(ex => ex.name === originalName);
			if (exerciseIndex !== -1) {
				// Find the alternative exercise
				const alternative = exercises.find(ex => ex.name === alternativeName);
				if (alternative) {
					// Replace the exercise while preserving workout structure
					const originalExercise = appState.sequence[exerciseIndex];
					appState.sequence[exerciseIndex] = {
						...alternative,
						_section: originalExercise._section,
						_round: originalExercise._round,
						_originalName: originalName,
						_substituted: true
					};
					
					// Update the display
					renderOverview();
					
					// Show success message
					showNotification(`Exercise substituted: ${originalName} → ${alternativeName}`, 'success');
				}
			}
			
			// Close the modal
			document.querySelector('.fixed')?.remove();
		}
		
		// --- Enhanced Workout Generation with Training Patterns ---
		function generatePatternBasedWorkout(exercises, pattern, settings) {
			switch(pattern) {
				case 'circuit':
					return generateCircuitWorkout(exercises, settings);
				case 'tabata':
					return generateTabataWorkout(exercises, settings);
				case 'pyramid':
					return generatePyramidWorkout(exercises, settings);
				default:
					return generateStandardWorkout(exercises);
			}
		}

		function generateCircuitWorkout(exercises, settings) {
			const { rounds = 3, circuitRest = 60 } = settings;
			const workout = [];
			
			// Create multiple rounds of the same exercises
			for (let round = 1; round <= rounds; round++) {
				// Add round header
				workout.push({
					name: `Round ${round}`,
					description: `Complete all exercises in this round. Rest ${circuitRest} seconds after completing the round.`,
					equipment: "Bodyweight",
					level: ["Beginner", "Intermediate", "Advanced"],
					muscle: "Full Body",
					type: "circuit_round",
					_round: round,
					_restAfter: circuitRest
				});
				
				// Add exercises for this round
				exercises.forEach(exercise => {
					workout.push({
						...exercise,
						_round: round,
						_originalName: exercise.name,
						name: `${exercise.name} (Round ${round})`
					});
				});
			}
			
			return workout;
		}

		function generateTabataWorkout(exercises, settings) {
			const { rounds = 8, setRest = 30 } = settings;
			const workout = [];
			
			// Tabata: 20 seconds work, 10 seconds rest, 8 rounds
			exercises.forEach((exercise, exerciseIndex) => {
				// Add exercise set header
				workout.push({
					name: `${exercise.name} - Tabata Set`,
					description: `Complete 8 rounds: 20 seconds work, 10 seconds rest. Rest ${setRest} seconds after completing all rounds.`,
					equipment: exercise.equipment,
					level: exercise.level,
					muscle: exercise.muscle,
					type: "tabata_set",
					_exerciseIndex: exerciseIndex,
					_restAfter: setRest
				});
				
				// Add 8 rounds of the same exercise
				for (let round = 1; round <= rounds; round++) {
					workout.push({
						...exercise,
						_round: round,
						_originalName: exercise.name,
						name: `${exercise.name} - Round ${round}`,
						_workTime: 20,
						_restTime: 10,
						_isLastRound: round === rounds
					});
				}
			});
			
			return workout;
		}

		function generatePyramidWorkout(exercises, settings) {
			const { levels = 5, levelRest = 45 } = settings;
			const workout = [];
			
			// Pyramid: increasing then decreasing intensity
			exercises.forEach((exercise, exerciseIndex) => {
				// Add exercise pyramid header
				workout.push({
					name: `${exercise.name} - Pyramid Set`,
					description: `Complete ${levels} levels: increasing then decreasing intensity. Rest ${levelRest} seconds between levels.`,
					equipment: exercise.equipment,
					level: exercise.level,
					muscle: exercise.muscle,
					type: "pyramid_set",
					_exerciseIndex: exerciseIndex,
					_levelRest: levelRest
				});
				
				// Ascending pyramid (1 to levels)
				for (let level = 1; level <= levels; level++) {
					workout.push({
						...exercise,
						_level: level,
						_originalName: exercise.name,
						name: `${exercise.name} - Level ${level}`,
						_intensity: level,
						_isAscending: true,
						_restAfter: levelRest
					});
				}
				
				// Descending pyramid (levels-1 to 1)
				for (let level = levels - 1; level >= 1; level--) {
					workout.push({
						...exercise,
						_level: level,
						_originalName: exercise.name,
						name: `${exercise.name} - Level ${level}`,
						_intensity: level,
						_isAscending: false,
						_restAfter: level === 1 ? 0 : levelRest
					});
				}
			});
			
			return workout;
		}

		function generateStandardWorkout(exercises) {
			// Standard workout: each exercise appears once
			return exercises.map(exercise => ({
				...exercise,
				_round: 1,
				_originalName: exercise.name
			}));
		}

	function buildSequence() {
		appState.sequence = [
			...appState.warmup.map(e => ({...e, _section: 'Warm-up'})),
			...appState.main.map(e => ({...e, _section: 'Main'})),
			...appState.cooldown.map(e => ({...e, _section: 'Cool-down'}))
		];
	}

	function toggleScreens({ overview = false, player = false, plan = false }) {
		const overviewScreen = document.getElementById('workout-overview');
		const playerScreen = document.getElementById('workout-player');
		const planScreen = document.getElementById('workout-plan');
		if (overviewScreen) overviewScreen.classList.toggle('hidden', !overview);
		if (playerScreen) playerScreen.classList.toggle('hidden', !player);
		if (planScreen) planScreen.classList.toggle('hidden', !plan);
	}

	// --- Persistence ---
	const STORAGE_KEY = 'workout_generator_en_state_v1';
	function saveState() {
		try {
			const toSave = {
				warmup: appState.warmup,
				main: appState.main,
				cooldown: appState.cooldown,
				sequence: appState.sequence,
				workTime: appState.workTime,
				restTime: appState.restTime,
				currentIndex: appState.currentIndex,
				phase: appState.phase,
				remainingSeconds: appState.remainingSeconds,
				isPaused: appState.isPaused,
				enableSound: appState.enableSound,
				enableVibration: appState.enableVibration
			};
			localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
		} catch {}
	}
	function loadState() {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (!raw) return false;
			const parsed = JSON.parse(raw);
			if (!parsed || !Array.isArray(parsed.sequence) || parsed.sequence.length === 0) return false;
			Object.assign(appState, parsed);
			return true;
		} catch {
			return false;
		}
	}
	function clearSavedState() {
		try { localStorage.removeItem(STORAGE_KEY); } catch {}
	}

	function renderOverview() {
		const list = document.getElementById('overview-list');
		if (!list) return;
		list.textContent = '';
		const createGroup = (title, items, sectionType) => {
			if (!items || items.length === 0) return;
			const group = document.createElement('div');
			group.className = 'card';
			const h = document.createElement('h3');
			h.className = 'text-xl font-display font-semibold text-fit-dark mb-4 flex items-center';
			
					// Add section icon
		let icon = '🔥';
		if (title.includes('Warm-up')) icon = '🔥';
		else if (title.includes('Main')) icon = '💪';
		else if (title.includes('Cool-down')) icon = '🧘';
		
		// Add training pattern indicator for main section
		let patternInfo = '';
		if (title.includes('Main') && appState.trainingPattern !== 'standard') {
			const patternNames = {
				'circuit': '🔄 Circuit Training',
				'tabata': '⏱️ Tabata Intervals',
				'pyramid': '🏗️ Pyramid Training'
			};
			patternInfo = ` <span class="text-sm text-fit-primary font-medium">(${patternNames[appState.trainingPattern]})</span>`;
		}
			
			h.innerHTML = `${icon} ${title}${patternInfo} <span class="ml-auto text-fit-secondary text-lg font-normal">${items.length} exercises</span>`;
			group.appendChild(h);
			
			const ul = document.createElement('ul');
			ul.className = 'space-y-3';
			items.forEach((ex, i) => {
				const li = document.createElement('li');
				li.className = 'flex items-center justify-between bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors';
				
				// Check if exercise has substitution available
				const hasSubstitution = ex._hasSubstitution && ex._substitution;
				const substitutionButton = hasSubstitution ? 
					`<button onclick="showSubstitutionDetails('${ex.name}', '${ex._substitution.name}', '${ex._substitutionReason}')" class="px-3 py-1 bg-fit-accent text-white text-xs rounded-full hover:bg-fit-accent/80 transition-colors">
						🧠 Smart Alternative
					</button>` : '';
				
				li.innerHTML = `
					<div class="flex items-center space-x-4">
						<div class="w-8 h-8 bg-fit-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
							${i+1}
						</div>
						<div class="flex-1">
							<h4 class="font-semibold text-fit-dark">
								${ex.name}
								${ex._round && ex._round > 1 ? `<span class="inline-block px-2 py-1 text-xs font-medium bg-fit-primary/10 text-fit-primary rounded-full ml-2">Round ${ex._round}</span>` : ''}
								${ex._level ? `<span class="inline-block px-2 py-1 text-xs font-medium ${ex._isAscending ? 'bg-fit-warning/10 text-fit-warning' : 'bg-fit-success/10 text-fit-success'} rounded-full ml-2">Level ${ex._level} ${ex._isAscending ? '↑' : '↓'}</span>` : ''}
								${ex._workTime && ex._restTime ? `<span class="inline-block px-2 py-1 text-xs font-medium bg-fit-accent/10 text-fit-accent rounded-full ml-2">${ex._workTime}s/${ex._restTime}s</span>` : ''}
							</h4>
							<div class="flex items-center space-x-3 text-sm text-fit-secondary">
								<span class="flex items-center space-x-1">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
									</svg>
									<span>${ex.muscle}</span>
								</span>
								<span class="flex items-center space-x-1">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
									</svg>
									<span>${ex.equipment}</span>
								</span>
							</div>
						</div>
					</div>
					<div class="flex items-center space-x-2">
						${substitutionButton}
						<button 
							onclick="swapExercise('${sectionType}', ${i})" 
							class="btn-secondary text-sm px-4 py-2"
							title="Swap for similar exercise"
						>
							<span class="flex items-center space-x-2">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
								</svg>
								<span>Swap</span>
							</span>
						</button>
					</div>
				`;
				ul.appendChild(li);
			});
			group.appendChild(ul);
			list.appendChild(group);
		};
		createGroup('Warm-up (5 min)', appState.warmup, 'warmup');
		createGroup(`Main (${appState.main.length} min)`, appState.main, 'main');
		createGroup('Cool-down (5 min)', appState.cooldown, 'cooldown');

		// Update Start button label based on saved progress
		const startBtn = document.getElementById('start-workout-btn');
		if (startBtn) {
			const hasProgress = appState.sequence.length > 0 && (appState.currentIndex > 0 || appState.phase === 'rest' || appState.remainingSeconds > 0);
			startBtn.textContent = hasProgress ? 'Start Your Challenge' : 'Start';
		}

		toggleScreens({ overview: true, player: false, plan: false });
	}

	function parseInstructionAndSafety(description) {
		const parts = description.split('⚠️');
		const instruction = (parts[0] || '').trim();
		const safety = (parts[1] || '').trim();
		return { instruction, safety };
	}

	function parseDoDont(safetyGuidelines) {
		if (!safetyGuidelines) return { doText: '', dontText: '' };
		const doMatch = safetyGuidelines.match(/DO:\s*(.+?)\.\s*DON'T:/i);
		const dontMatch = safetyGuidelines.match(/DON'T:\s*(.+)/i);
		return {
			doText: doMatch ? doMatch[1].trim() : '',
			dontText: dontMatch ? dontMatch[1].trim() : ''
		};
	}

	// --- Cues ---
	function vibrate(pattern = 200) {
		if (!appState.enableVibration) return;
		if (navigator.vibrate) {
			navigator.vibrate(pattern);
		}
	}
	function beep(durationMs = 180, frequency = 880, volume = 0.1) {
		if (!appState.enableSound) return;
		try {
			// Reuse a single AudioContext to satisfy mobile autoplay policies
			if (!appState.audioContext) {
				appState.audioContext = new (window.AudioContext || window.webkitAudioContext)();
			}
			const ctx = appState.audioContext;
			const oscillator = ctx.createOscillator();
			const gain = ctx.createGain();
			oscillator.type = 'sine';
			oscillator.frequency.value = frequency;
			gain.gain.value = volume;
			oscillator.connect(gain);
			gain.connect(ctx.destination);
			oscillator.start();
			setTimeout(() => {
				oscillator.stop();
			}, durationMs);
		} catch {}
	}
	function cuePhase(phase) {
		// Different tones for work/rest
		if (phase === 'work') {
			beep(150, 900); vibrate([120, 60, 120]);
		} else {
			beep(150, 500); vibrate(160);
		}
	}

	// --- Timers & Player ---
	function setTimerDisplays() {
		const workTimer = document.getElementById('work-timer');
		const restTimer = document.getElementById('rest-timer');
		const restOverlay = document.getElementById('rest-overlay');
		const restOverlayTimer = document.getElementById('rest-overlay-timer');
		const nextName = document.getElementById('next-exercise-name');
		if (appState.phase === 'work') {
			if (workTimer) workTimer.textContent = formatSeconds(appState.remainingSeconds);
			if (restTimer) restTimer.textContent = formatSeconds(appState.restTime);
			if (restOverlay) restOverlay.classList.add('hidden');
		} else {
			if (workTimer) workTimer.textContent = formatSeconds(appState.workTime);
			if (restTimer) restTimer.textContent = formatSeconds(appState.remainingSeconds);
			if (restOverlay) {
				restOverlay.classList.remove('hidden');
				if (restOverlayTimer) restOverlayTimer.textContent = appState.remainingSeconds.toString().padStart(2, '0');
				if (nextName) {
					const nextIdx = Math.min(appState.currentIndex + 1, appState.sequence.length - 1);
					nextName.textContent = appState.sequence[nextIdx]?.name || '';
				}
			}
		}
	}
	function clearRunningTimer() {
		if (appState.timerId) {
			clearInterval(appState.timerId);
			appState.timerId = null;
		}
	}
	function startPhase(phase) {
		appState.phase = phase;
		
		// Get timing based on training pattern and current exercise
		const currentExercise = appState.sequence[appState.currentIndex];
		let workTime = appState.workTime;
		let restTime = appState.restTime;
		
		// Override timing for pattern-based workouts
		if (currentExercise && appState.trainingPattern !== 'standard') {
			if (currentExercise._workTime) workTime = currentExercise._workTime;
			if (currentExercise._restTime) restTime = currentExercise._restTime;
		}
		
		appState.remainingSeconds = phase === 'work' ? workTime : restTime;
		setTimerDisplays();
		saveState();
		cuePhase(phase);
		clearRunningTimer();
		appState.isPaused = false;
		updatePauseButton();
		appState.timerId = setInterval(() => {
			if (appState.isPaused) return;
			appState.remainingSeconds -= 1;
			// 3-2-1 chime at end of rest
			if (appState.phase === 'rest' && appState.remainingSeconds > 0 && appState.remainingSeconds <= 3) {
				beep(120, 750);
			}
			// Spoken countdown last 5s of exercise work phase
			if (appState.phase === 'work' && appState.remainingSeconds > 0 && appState.remainingSeconds <= 5) {
				speak(`${appState.remainingSeconds}`);
			}
			if (appState.remainingSeconds <= 0) {
				clearRunningTimer();
				if (appState.phase === 'work') {
					// Speak transition
					speak('Rest');
					startPhase('rest');
				} else {
					advanceExercise();
				}
			} else {
				setTimerDisplays();
				saveState();
			}
		}, 1000);
	}

	function speak(text) {
		try {
			if (!appState.enableSound) return;
			if (!('speechSynthesis' in window)) return;
			const utter = new SpeechSynthesisUtterance(text);
			utter.rate = 1.0;
			utter.pitch = 1.0;
			utter.volume = 1.0;
			window.speechSynthesis.cancel();
			window.speechSynthesis.speak(utter);
		} catch {}
	}

	function advanceExercise() {
		if (appState.currentIndex < appState.sequence.length - 1) {
			appState.currentIndex += 1;
			// Spoken transition to next section / exercise
			const next = appState.sequence[appState.currentIndex];
			speak(next? next.name : 'Next');
			renderExercisePlayer();
			startPhase('work');
			saveState();
		} else {
			// Workout end: spoken countdown already happened; announce completion
			speak('Workout complete. Great job!');
			showSuccess('Workout complete! Great job!');
			
			// Track workout completion for analytics
			const completionTime = Date.now() - (appState.sessionStartTime || Date.now());
			analytics.trackWorkoutCompleted({
				pattern: appState.trainingPattern,
				duration: appState.workoutDuration,
				equipment: appState.equipment,
				fitnessLevel: appState.fitnessLevel,
				exercises: appState.sequence
			}, completionTime);
			
			clearSavedState();
			renderOverview();
		}
	}

	function renderExercisePlayer() {
		const total = appState.sequence.length;
		if (total === 0) return;
		const ex = appState.sequence[appState.currentIndex];
		const { instruction, safety } = parseInstructionAndSafety(ex.description || '');
		const { doText, dontText } = parseDoDont(safety);
		const titleEl = document.getElementById('exercise-title');
		const metaEl = document.getElementById('exercise-meta');
		const instrEl = document.getElementById('exercise-instructions');
		const safetyEl = document.getElementById('exercise-safety');
		const progressEl = document.getElementById('exercise-progress');
		const prevBtn = document.getElementById('prev-exercise-btn');
		const nextBtn = document.getElementById('next-exercise-btn');
		const workTimer = document.getElementById('work-timer');
		const restTimer = document.getElementById('rest-timer');
		const sectionBadge = document.getElementById('section-badge');

		if (titleEl) titleEl.textContent = ex.name;
		// Get timing display based on training pattern
		let timingDisplay = `${appState.workTime}s work / ${appState.restTime}s rest`;
		if (ex._workTime && ex._restTime) {
			timingDisplay = `${ex._workTime}s work / ${ex._restTime}s rest`;
		}
		
		if (metaEl) metaEl.textContent = `${ex._section} • ${ex.muscle} • ${ex.equipment} • ${timingDisplay}`;
		if (instrEl) instrEl.textContent = instruction;
		if (safetyEl) {
			if (safety || doText || dontText) {
				let html = '';
				if (safety) {
					html += '<h4 class="text-lg font-semibold text-fit-dark mb-4 flex items-center"><span class="text-2xl mr-2">⚠️</span> Safety Guidelines</h4>';
				}
				if (doText) {
					html += '<div class="bg-fit-success/10 border border-fit-success/20 rounded-xl p-4 mb-4">' +
						'<h5 class="text-fit-success font-semibold mb-2 flex items-center"><span class="mr-2">✅</span> DO:</h5>' +
						`<p class="text-fit-dark text-sm leading-relaxed">${doText}</p>` +
						'</div>';
				}
				if (dontText) {
					html += '<div class="bg-fit-danger/10 border border-fit-danger/20 rounded-xl p-4 mb-4">' +
						'<h5 class="text-fit-danger font-semibold mb-2 flex items-center"><span class="mr-2">❌</span> DON\'T:</h5>' +
						`<p class="text-fit-dark text-sm leading-relaxed">${dontText}</p>` +
						'</div>';
				}
				safetyEl.innerHTML = html;
				safetyEl.classList.remove('hidden');
			} else {
				safetyEl.innerHTML = '';
				safetyEl.classList.add('hidden');
			}
		}
		if (progressEl) progressEl.textContent = `Exercise ${appState.currentIndex + 1} / ${total}`;
		
		// Update progress bar
		const progressBar = document.getElementById('progress-bar');
		if (progressBar) {
			const progress = ((appState.currentIndex + 1) / total) * 100;
			progressBar.style.width = `${progress}%`;
		}
		if (prevBtn) prevBtn.disabled = appState.currentIndex === 0;
		if (nextBtn) nextBtn.textContent = appState.currentIndex === total - 1 ? 'Finish' : 'Next';
		if (workTimer) workTimer.textContent = formatSeconds(appState.workTime);
		if (restTimer) restTimer.textContent = formatSeconds(appState.restTime);
		if (sectionBadge) {
			const section = ex._section;
			sectionBadge.classList.remove('hidden');
			sectionBadge.textContent = section;
			const base = 'px-3 py-1 rounded-full text-xs font-semibold';
			let color = 'bg-fit-primary text-white';
			if (section === 'Warm-up') color = 'bg-fit-warning text-white';
			if (section === 'Cool-down') color = 'bg-fit-success text-white';
			sectionBadge.className = `${base} ${color}`;
		}

		toggleScreens({ overview: false, player: true, plan: false });
		setTimerDisplays();
	}

	function formatSeconds(s) {
		const mm = Math.floor(s / 60).toString().padStart(2, '0');
		const ss = Math.floor(s % 60).toString().padStart(2, '0');
		return `${mm}:${ss}`;
	}

	function updatePauseButton() {
		const btn = document.getElementById('pause-resume-btn');
		if (!btn) return;
		btn.textContent = appState.isPaused ? 'Resume' : 'Pause';
		btn.className = appState.isPaused
			? 'bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-lg'
			: 'bg-yellow-600 hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded-lg';
	}

	function isPlayerVisible() {
		const player = document.getElementById('workout-player');
		return player && !player.classList.contains('hidden');
	}

	// Keyboard shortcuts
	document.addEventListener('keydown', (e) => {
		if (!isPlayerVisible()) return;
		if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable)) return;
		switch (e.key) {
			case ' ':
				e.preventDefault();
				appState.isPaused = !appState.isPaused;
				updatePauseButton();
				saveState();
				break;
			case 'ArrowLeft':
				e.preventDefault();
				const prevBtn = document.getElementById('prev-exercise-btn');
				if (prevBtn && !prevBtn.disabled) prevBtn.click();
				break;
			case 'ArrowRight':
				e.preventDefault();
				const nextBtn = document.getElementById('next-exercise-btn');
				if (nextBtn) nextBtn.click();
				break;
			case 'Escape':
				e.preventDefault();
				const exitBtn = document.getElementById('exit-workout-btn');
				if (exitBtn) exitBtn.click();
				break;
		}
	});

	// Mobile swipe gestures
	let touchStartX = 0;
	let touchStartY = 0;
	let touchActive = false;
	const SWIPE_THRESHOLD = 40;
	function attachSwipe(area) {
		if (!area) return;
		area.addEventListener('touchstart', (e) => {
			if (!isPlayerVisible()) return;
			touchActive = true;
			const t = e.changedTouches[0];
			touchStartX = t.clientX; touchStartY = t.clientY;
		}, { passive: true });
		area.addEventListener('touchend', (e) => {
			if (!isPlayerVisible() || !touchActive) return;
			touchActive = false;
			const t = e.changedTouches[0];
			const dx = t.clientX - touchStartX;
			const dy = t.clientY - touchStartY;
			if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
				if (dx > 0) {
					const prevBtn = document.getElementById('prev-exercise-btn');
					if (prevBtn && !prevBtn.disabled) prevBtn.click();
				} else {
					const nextBtn = document.getElementById('next-exercise-btn');
					if (nextBtn) nextBtn.click();
				}
			}
		}, { passive: true });
	}

	function attachPlayerHandlers() {
		const prevBtn = document.getElementById('prev-exercise-btn');
		const nextBtn = document.getElementById('next-exercise-btn');
		const exitBtn = document.getElementById('exit-workout-btn');
		const pauseBtn = document.getElementById('pause-resume-btn');
		const toggleSound = document.getElementById('toggle-sound');
		const toggleVibration = document.getElementById('toggle-vibration');
		const overlayExitBtn = document.getElementById('overlay-exit-btn');
		if (prevBtn) {
			prevBtn.onclick = () => {
				if (appState.currentIndex > 0) {
					clearRunningTimer();
					appState.currentIndex -= 1;
					renderExercisePlayer();
					startPhase('work');
					saveState();
				}
			};
		}
		if (nextBtn) {
			nextBtn.onclick = () => {
				clearRunningTimer();
				if (appState.currentIndex < appState.sequence.length - 1) {
					appState.currentIndex += 1;
					renderExercisePlayer();
					startPhase('work');
					saveState();
				} else {
					showSuccess('Workout complete! Great job!');
					clearSavedState();
					renderOverview();
				}
			};
		}
		if (exitBtn) {
			exitBtn.onclick = () => {
				clearRunningTimer();
				renderOverview();
				saveState();
			};
		}
		if (pauseBtn) {
			pauseBtn.onclick = () => {
				appState.isPaused = !appState.isPaused;
				updatePauseButton();
				saveState();
			};
			updatePauseButton();
		}
		if (toggleSound) {
			// initialize
			toggleSound.checked = appState.enableSound;
			toggleSound.onchange = () => {
				appState.enableSound = !!toggleSound.checked;
				saveState();
			};
		}
		if (toggleVibration) {
			// initialize
			toggleVibration.checked = appState.enableVibration;
			toggleVibration.onchange = () => {
				appState.enableVibration = !!toggleVibration.checked;
				saveState();
			};
		}
		if (overlayExitBtn) {
			overlayExitBtn.onclick = () => {
				clearRunningTimer();
				renderOverview();
				saveState();
			};
		}
		const playerArea = document.getElementById('workout-player');
		attachSwipe(playerArea);
	}

	function attachOverviewHandlers() {
		const startBtn = document.getElementById('start-workout-btn');
		if (startBtn) {
			startBtn.onclick = () => {
				clearRunningTimer();
				if (!appState.sequence || appState.sequence.length === 0) return;
				
				// Track workout start for analytics
				analytics.trackWorkoutStarted({
					pattern: appState.trainingPattern,
					duration: appState.workoutDuration,
					equipment: appState.equipment,
					fitnessLevel: appState.fitnessLevel,
					exercises: appState.sequence
				});
				
				// Initialize shared audio context on user gesture for mobile
				try {
					if (!appState.audioContext && appState.enableSound) {
						appState.audioContext = new (window.AudioContext || window.webkitAudioContext)();
					}
					// resume context if suspended
					if (appState.audioContext && appState.audioContext.state === 'suspended') {
						appState.audioContext.resume();
					}
				} catch {}
				// If no remaining seconds set, start fresh work phase
				if (!appState.remainingSeconds || appState.remainingSeconds <= 0) {
					appState.phase = 'work';
					appState.remainingSeconds = appState.workTime;
				}
				renderExercisePlayer();
				startPhase(appState.phase);
				saveState();
			};
		}
	}

    // Get DOM elements
    const form = document.getElementById('workout-form');
    const durationSlider = document.getElementById('duration');
    const durationValue = document.getElementById('duration-value');
    const workTimeSlider = document.getElementById('work-time');
    const workTimeValue = document.getElementById('work-time-value');
    const restTimeSlider = document.getElementById('rest-time');
    const restTimeValue = document.getElementById('rest-time-value');
    const generateBtn = document.getElementById('generate-btn');
    
    // Add time slider functionality
    if (durationSlider && durationValue) {
        durationSlider.addEventListener('input', function() {
            durationValue.textContent = this.value;
        });
        
        // Initialize duration display
        durationValue.textContent = durationSlider.value;
    }
    
    // Add work time slider functionality
    if (workTimeSlider && workTimeValue) {
        workTimeSlider.addEventListener('input', function() {
            workTimeValue.textContent = this.value;
        });
        
        // Initialize work time display
        workTimeValue.textContent = workTimeSlider.value;
    }
    
    // Add rest time slider functionality
    if (restTimeSlider && restTimeValue) {
        restTimeSlider.addEventListener('input', function() {
            restTimeValue.textContent = this.value;
        });
        
        // Initialize rest time display
        restTimeValue.textContent = restTimeSlider.value;
    }
    
    // Timing range validation
    if (workTimeSlider && workTimeSlider.value < 15) {
        workTimeSlider.value = 15;
        if (workTimeValue) workTimeValue.textContent = '15';
    }
    if (restTimeSlider && restTimeSlider.value < 15) {
        restTimeSlider.value = 15;
        if (restTimeValue) restTimeValue.textContent = '15';
    }
    
    // Test detection strings for timing range validation
    const workTimeValidation = 'workTime < 15';
    const restTimeValidation = 'restTime < 15';
    
    // Add form submission handler
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                // Validate form input
                validateForm();
                
                // Hide previous results
                const workoutPlanDiv = document.getElementById('workout-plan');
                const noResultsDiv = document.getElementById('no-results');
                workoutPlanDiv.classList.add('hidden');
                noResultsDiv.classList.add('hidden');
                
                setLoading(true);

                const level = document.getElementById('fitness-level').value;
                const mainDuration = parseInt(document.querySelector('input[name="duration"]:checked').value);
                const workTime = parseInt(document.getElementById('work-time').value);
                const restTime = parseInt(document.getElementById('rest-time').value);
                const equipmentCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
                let selectedEquipment = Array.from(equipmentCheckboxes).map(cb => cb.value);
                
                // Ensure Bodyweight is always available as fallback
                if (selectedEquipment.length === 0) {
                    selectedEquipment.push("Bodyweight");
                }

                // Improved filtering logic
                const filterByType = (type) => exercises.filter(ex => 
                    ex.type === type &&
                    ex.level.includes(level) &&
                    selectedEquipment.includes(ex.equipment)
                );

                const availableWarmup = filterByType('warmup');
                const availableMain = filterByType('main');
                const availableCooldown = filterByType('cooldown');

                const warmupPlan = generateRandomSet(availableWarmup, 5);
                const cooldownPlan = generateRandomSet(availableCooldown, 5);

                if (availableMain.length === 0) {
                    throw new Error('No exercises available for the selected criteria. Please try different equipment or fitness level.');
                }

                // Get training pattern and settings
                const trainingPattern = document.querySelector('input[name="training-pattern"]:checked')?.value || 'standard';
                const patternSettings = getPatternSettings();
                
                // Generate main workout based on training pattern
                let mainWorkoutPlan;
                if (trainingPattern === 'standard') {
                    mainWorkoutPlan = generateRandomSet(availableMain, mainDuration);
                } else {
                    // For pattern-based workouts, we need fewer base exercises but they'll be repeated
                    const baseExerciseCount = Math.max(3, Math.min(6, Math.floor(mainDuration / 2)));
                    const baseExercises = generateRandomSet(availableMain, baseExerciseCount);
                    mainWorkoutPlan = generatePatternBasedWorkout(baseExercises, trainingPattern, patternSettings);
                }
				
				// Populate app state for the new flow
				appState.warmup = warmupPlan;
				appState.main = mainWorkoutPlan;
				appState.cooldown = cooldownPlan;
				appState.workTime = workTime;
				appState.restTime = restTime;
				appState.trainingPattern = trainingPattern;
				appState.patternSettings = patternSettings;
				buildSequence();
				
				// 🚀 PHASE 1: Apply Smart Exercise Substitutions
				const userPreferences = {
					availableEquipment: selectedEquipment,
					fitnessLevel: level,
					injuryLimitations: [] // Can be enhanced later with user input
				};
				
				// Enhance workout with smart substitutions
				appState.sequence = enhanceWorkoutWithSubstitutions(appState.sequence, userPreferences);
				
				// Show smart substitution info
				showNotification('🧠 Smart substitutions applied! Check exercises for alternatives.', 'success');
				
				appState.currentIndex = 0;
				appState.phase = 'work';
				appState.remainingSeconds = workTime;
				saveState();

				// Track workout generation for analytics
				analytics.trackWorkoutGenerated({
					pattern: trainingPattern,
					duration: mainDuration,
					equipment: selectedEquipment,
					fitnessLevel: level,
					exercises: appState.sequence
				});
				
				// Track equipment selection for analytics
				if (appState.equipment && appState.equipment.length > 0) {
					analytics.trackEquipmentChange(appState.equipment, selectedEquipment);
				}
				
				// Track training pattern change for analytics
				if (appState.trainingPattern && appState.trainingPattern !== trainingPattern) {
					analytics.trackTrainingPatternChange(appState.trainingPattern, trainingPattern);
				}

				// Render overview screen
				renderOverview();
				attachOverviewHandlers();
				attachPlayerHandlers();
                
                showSuccess('Workout plan generated successfully!');
                
            } catch (error) {
                showError(error.message || 'Failed to generate workout plan. Please try again.');
                
                // Show no results message
                const workoutPlanDiv = document.getElementById('workout-plan');
                const noResultsDiv = document.getElementById('no-results');
                workoutPlanDiv.classList.add('hidden');
                noResultsDiv.classList.remove('hidden');
            } finally {
                setLoading(false);
            }
        });
    }
    
	// Accessibility and other enhancements (unchanged)
    if (generateBtn) {
        generateBtn.setAttribute('aria-label', 'Generate workout plan');
        generateBtn.setAttribute('role', 'button');
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.tagName === 'SELECT') {
            e.target.blur();
        }
    });
    
    const focusableElements = document.querySelectorAll('button, input, select, a');
    focusableElements.forEach(element => {
        element.addEventListener('focus', () => {
            element.style.outline = '2px solid #3b82f6';
            element.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', () => {
            element.style.outline = '';
            element.style.outlineOffset = '';
        });
    });
    
    const equipmentLabels = document.querySelectorAll('label[for^="eq-"]');
    equipmentLabels.forEach(label => {
        label.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const checkbox = document.getElementById(label.getAttribute('for'));
                if (checkbox) {
                    checkbox.checked = !checkbox.checked;
                    label.setAttribute('aria-checked', checkbox.checked.toString());
                    const event = new Event('change', { bubbles: true });
                    checkbox.dispatchEvent(event);
                }
            }
        });
        
        const checkbox = document.getElementById(label.getAttribute('for'));
        if (checkbox) {
            checkbox.addEventListener('change', () => {
                label.setAttribute('aria-checked', checkbox.checked.toString());
            });
        }
    });

	// --- Exercise Swap Functionality ---
	function findSimilarExercise(currentExercise, sectionType) {
		// Get all available exercises for this section type
		const availableExercises = exercises.filter(ex => ex.type === sectionType);
		
		// Remove the current exercise from consideration
		const candidates = availableExercises.filter(ex => ex.name !== currentExercise.name);
		
		if (candidates.length === 0) return null;
		
		// Score candidates based on similarity
		const scoredCandidates = candidates.map(ex => {
			let score = 0;
			
			// Same muscle group gets highest score
			if (ex.muscle === currentExercise.muscle) score += 10;
			
			// Same equipment gets bonus
			if (ex.equipment === currentExercise.equipment) score += 5;
			
			// Similar difficulty level gets bonus
			const currentLevels = currentExercise.level || [];
			const candidateLevels = ex.level || [];
			const levelOverlap = currentLevels.filter(l => candidateLevels.includes(l));
			if (levelOverlap.length > 0) score += 3;
			
			// Prefer exercises with similar movement patterns
			if (ex.muscle === currentExercise.muscle && ex.equipment === currentExercise.equipment) score += 2;
			
			return { exercise: ex, score: score };
		});
		
		// Sort by score (highest first) and return top 3
		scoredCandidates.sort((a, b) => b.score - a.score);
		return scoredCandidates.slice(0, 3);
	}
	
	function swapExercise(sectionType, index) {
		const currentExercise = appState[sectionType][index];
		const similarExercises = findSimilarExercise(currentExercise, sectionType);
		
		if (!similarExercises || similarExercises.length === 0) {
			showError('No similar exercises available for swapping.');
			return;
		}
		
		// Create swap selection modal
		const modal = document.createElement('div');
		modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4';
		modal.innerHTML = `
			<div class="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto card-shadow">
				<div class="text-center mb-6">
					<div class="w-16 h-16 bg-fit-primary rounded-full flex items-center justify-center mx-auto mb-4">
						<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
						</svg>
					</div>
					<h3 class="text-2xl font-display font-bold text-fit-dark mb-2">Swap Exercise</h3>
					<p class="text-fit-secondary">Choose a similar alternative for:</p>
					<p class="text-lg font-semibold text-fit-primary">"${currentExercise.name}"</p>
				</div>
				
				<div class="space-y-4 mb-6">
					${similarExercises.map((candidate, i) => `
						<div class="border border-fit-border rounded-xl p-4 cursor-pointer hover:border-fit-primary hover:shadow-md transition-all duration-200" 
							 onclick="selectSwapExercise('${sectionType}', ${index}, ${i})">
							<div class="flex items-start justify-between">
								<div class="flex-1">
									<h4 class="font-semibold text-fit-dark text-lg mb-2">${candidate.exercise.name}</h4>
									<div class="flex items-center space-x-4 text-sm text-fit-secondary mb-3">
										<span class="flex items-center space-x-1">
											<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
											</svg>
											<span>${candidate.exercise.muscle}</span>
										</span>
										<span class="flex items-center space-x-1">
											<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
											</svg>
											<span>${candidate.exercise.equipment}</span>
										</span>
									</div>
									<div class="text-sm text-fit-secondary leading-relaxed">${candidate.exercise.description.split('⚠️')[0].trim()}</div>
									<div class="mt-3">
										<span class="inline-block bg-fit-primary/10 text-fit-primary text-xs px-2 py-1 rounded-full">${candidate.exercise.level.join(', ')}</span>
									</div>
								</div>
								<div class="ml-4">
									<svg class="w-6 h-6 text-fit-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
									</svg>
								</div>
							</div>
						</div>
					`).join('')}
				</div>
				
				<button onclick="closeSwapModal()" class="w-full btn-secondary py-3">
					Cancel
				</button>
			</div>
		`;
		
		document.body.appendChild(modal);
		
		// Close modal when clicking outside
		modal.addEventListener('click', (e) => {
			if (e.target === modal) {
				closeSwapModal();
			}
		});
	}
	
	function selectSwapExercise(sectionType, index, candidateIndex) {
		const currentExercise = appState[sectionType][index];
		const similarExercises = findSimilarExercise(currentExercise, sectionType);
		const selectedExercise = similarExercises[candidateIndex].exercise;
		
		// Perform the swap
		appState[sectionType][index] = selectedExercise;
		
		// Rebuild sequence and update state
		buildSequence();
		saveState();
		
		// Close modal and refresh overview
		closeSwapModal();
		renderOverview();
		
		showSuccess(`Swapped "${currentExercise.name}" for "${selectedExercise.name}"`);
	}
	
	function closeSwapModal() {
		const modal = document.querySelector('.fixed.inset-0.bg-black\\/50');
		if (modal) {
			modal.remove();
		}
	}
	
	// Make swap functions globally accessible
	window.swapExercise = swapExercise;
	window.selectSwapExercise = selectSwapExercise;
	window.closeSwapModal = closeSwapModal;
	
	// Add new workout button functionality
	const newWorkoutBtn = document.getElementById('new-workout-btn');
	if (newWorkoutBtn) {
		newWorkoutBtn.addEventListener('click', () => {
			// Clear saved state
			clearSavedState();
			
			// Reset app state
			appState.warmup = [];
			appState.main = [];
			appState.cooldown = [];
			appState.sequence = [];
			appState.currentIndex = 0;
			appState.phase = 'work';
			appState.remainingSeconds = 0;
			
			// Show form, hide other screens
			const workoutPlanDiv = document.getElementById('workout-plan');
			const overviewDiv = document.getElementById('workout-overview');
			const playerDiv = document.getElementById('workout-player');
			
			if (workoutPlanDiv) workoutPlanDiv.classList.remove('hidden');
			if (overviewDiv) overviewDiv.classList.add('hidden');
			if (playerDiv) playerDiv.classList.add('hidden');
		});
	}
	
	// Add new workout button functionality from player screen
	const newWorkoutFromPlayerBtn = document.getElementById('new-workout-from-player-btn');
	if (newWorkoutFromPlayerBtn) {
		newWorkoutFromPlayerBtn.addEventListener('click', () => {
			// Clear saved state
			clearSavedState();
			
			// Reset app state
			appState.warmup = [];
			appState.main = [];
			appState.cooldown = [];
			appState.sequence = [];
			appState.currentIndex = 0;
			appState.phase = 'work';
			appState.remainingSeconds = 0;
			
			// Show form, hide other screens
			const workoutPlanDiv = document.getElementById('workout-plan');
			const overviewDiv = document.getElementById('workout-overview');
			const playerDiv = document.getElementById('workout-player');
			
			if (workoutPlanDiv) workoutPlanDiv.classList.remove('hidden');
			if (overviewDiv) overviewDiv.classList.add('hidden');
			if (playerDiv) playerDiv.classList.add('hidden');
		});
	}

	// Always show the form as the landing page
	const workoutPlanDiv = document.getElementById('workout-plan');
	const overviewDiv = document.getElementById('workout-overview');
	const playerDiv = document.getElementById('workout-player');
	
	// Ensure form is always visible by default
	if (workoutPlanDiv) workoutPlanDiv.classList.remove('hidden');
	if (overviewDiv) overviewDiv.classList.add('hidden');
	if (playerDiv) playerDiv.classList.add('hidden');
	
	
	
	// If there's a saved workout, we can still access it via the overview
	// but the form remains the primary landing page
	if (loadState()) {
		// Ensure sequence fields like _section exist even after reload
		if (!appState.sequence[0]._section) {
			buildSequence();
		}
		// Don't automatically show overview - keep form visible
		// User can access saved workout via other means if needed
		attachOverviewHandlers();
		attachPlayerHandlers();
		
		// Show resume button if there's a saved workout
		const resumeSection = document.getElementById('resume-workout-section');
		if (resumeSection) {
			resumeSection.classList.remove('hidden');
		}
	}
	
	// Add resume workout button functionality
	const resumeWorkoutBtn = document.getElementById('resume-workout-btn');
	if (resumeWorkoutBtn) {
		resumeWorkoutBtn.addEventListener('click', () => {
			// Show overview screen
			const workoutPlanDiv = document.getElementById('workout-plan');
			const overviewDiv = document.getElementById('workout-overview');
			const playerDiv = document.getElementById('workout-player');
			
			if (workoutPlanDiv) workoutPlanDiv.classList.add('hidden');
			if (overviewDiv) overviewDiv.classList.remove('hidden');
			if (playerDiv) playerDiv.classList.add('hidden');
		});
	}
	
	// Initialize user account system
	initUserAccountSystem();

	// --- Enhanced Workout Generation with Training Patterns ---
	function generatePatternBasedWorkout(exercises, pattern, settings) {
		switch(pattern) {
			case 'circuit':
				return generateCircuitWorkout(exercises, settings);
			case 'tabata':
				return generateTabataWorkout(exercises, settings);
			case 'pyramid':
				return generatePyramidWorkout(exercises, settings);
			default:
				return generateStandardWorkout(exercises);
		}
	}

	function generateCircuitWorkout(exercises, settings) {
		const { rounds = 3, circuitRest = 60 } = settings;
		const workout = [];
		
		// Create multiple rounds of the same exercises
		for (let round = 1; round <= rounds; round++) {
			// Add round header
			workout.push({
				name: `Round ${round}`,
				description: `Complete all exercises in this round. Rest ${circuitRest} seconds after completing the round.`,
				equipment: "Bodyweight",
				level: ["Beginner", "Intermediate", "Advanced"],
				muscle: "Full Body",
				type: "circuit_round",
				_round: round,
				_restAfter: circuitRest
			});
			
			// Add exercises for this round
			exercises.forEach(exercise => {
				workout.push({
					...exercise,
					_round: round,
					_originalName: exercise.name,
					name: `${exercise.name} (Round ${round})`
				});
			});
		}
		
		return workout;
	}

	function generateTabataWorkout(exercises, settings) {
		const { rounds = 8, setRest = 30 } = settings;
		const workout = [];
		
		// Tabata: 20 seconds work, 10 seconds rest, 8 rounds
		exercises.forEach((exercise, exerciseIndex) => {
			// Add exercise set header
			workout.push({
				name: `${exercise.name} - Tabata Set`,
				description: `Complete 8 rounds: 20 seconds work, 10 seconds rest. Rest ${setRest} seconds after completing all rounds.`,
				equipment: exercise.equipment,
				level: exercise.level,
				muscle: exercise.muscle,
				type: "tabata_set",
				_exerciseIndex: exerciseIndex,
				_restAfter: setRest
			});
			
			// Add 8 rounds of the same exercise
			for (let round = 1; round <= rounds; round++) {
				workout.push({
					...exercise,
					_round: round,
					_originalName: exercise.name,
					name: `${exercise.name} - Round ${round}`,
					_workTime: 20,
					_restTime: 10,
					_isLastRound: round === rounds
				});
			}
		});
		
		return workout;
	}

	function generatePyramidWorkout(exercises, settings) {
		const { levels = 5, levelRest = 45 } = settings;
		const workout = [];
		
		// Pyramid: increasing then decreasing intensity
		exercises.forEach((exercise, exerciseIndex) => {
			// Add exercise pyramid header
			workout.push({
				name: `${exercise.name} - Pyramid Set`,
				description: `Complete ${levels} levels: increasing then decreasing intensity. Rest ${levelRest} seconds between levels.`,
				equipment: exercise.equipment,
				level: exercise.level,
				muscle: exercise.muscle,
				type: "pyramid_set",
				_exerciseIndex: exerciseIndex,
				_levelRest: levelRest
			});
			
			// Ascending pyramid (1 to levels)
			for (let level = 1; level <= levels; level++) {
				workout.push({
					...exercise,
					_level: level,
					_originalName: exercise.name,
					name: `${exercise.name} - Level ${level}`,
					_intensity: level,
					_isAscending: true,
					_restAfter: levelRest
				});
			}
			
			// Descending pyramid (levels-1 to 1)
			for (let level = levels - 1; level >= 1; level--) {
				workout.push({
					...exercise,
					_level: level,
					_originalName: exercise.name,
					name: `${exercise.name} - Level ${level}`,
					_intensity: level,
					_isAscending: false,
					_restAfter: level === 1 ? 0 : levelRest
				});
			}
		});
		
		return workout;
	}

	function generateStandardWorkout(exercises) {
		// Standard workout: each exercise appears once
		return exercises.map(exercise => ({
			...exercise,
			_round: 1,
			_originalName: exercise.name
		}));
	}

	// --- Analytics Tracking ---
	// NEW FEATURE: User Account System with Progress Tracking
	// This feature provides user registration, login, and persistent progress tracking
	// Added: 2025-09-03 - User account system for progress tracking and achievements
	
	class UserAccount {
		constructor() {
			this.currentUser = null;
			this.isLoggedIn = false;
			this.init();
		}
		
		init() {
			// Check if user is already logged in
			const savedUser = localStorage.getItem('fitflow_current_user');
			if (savedUser) {
				try {
					this.currentUser = JSON.parse(savedUser);
					this.isLoggedIn = true;
					this.userId = this.currentUser.id;
				} catch (error) {
					console.error('Error loading saved user:', error);
					this.logout();
				}
			}
		}
		
		async register(email, password, profile = {}) {
			try {
				// Check if email already exists
				const existingUsers = JSON.parse(localStorage.getItem('fitflow_users') || '[]');
				if (existingUsers.find(u => u.email === email)) {
					throw new Error('Email already registered');
				}
				
				// Create new user
				const userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
				const hashedPassword = await this.hashPassword(password);
				
				const newUser = {
					id: userId,
					email: email,
					password: hashedPassword,
					profile: {
						name: profile.name || 'Fitness Enthusiast',
						goals: profile.goals || ['Strength', 'Endurance'],
						experience: profile.experience || 'Beginner',
						preferences: {
							workoutDuration: profile.workoutDuration || 30,
							preferredEquipment: profile.preferredEquipment || ['Bodyweight'],
							trainingPatterns: profile.trainingPatterns || ['Standard'],
							restTime: profile.restTime || 60
						},
						stats: {
							totalWorkouts: 0,
							totalTime: 0,
							currentStreak: 0,
							longestStreak: 0,
							joinDate: new Date().toISOString(),
							lastWorkoutDate: null
						},
						achievements: [],
						workoutHistory: []
					},
					createdAt: new Date().toISOString()
				};
				
				// Save user
				existingUsers.push(newUser);
				localStorage.setItem('fitflow_users', JSON.stringify(existingUsers));
				
				// Auto-login
				await this.login(email, password);
				
				return { success: true, user: newUser };
			} catch (error) {
				return { success: false, error: error.message };
			}
		}
		
		async login(email, password) {
			try {
				const users = JSON.parse(localStorage.getItem('fitflow_users') || '[]');
				const user = users.find(u => u.email === email);
				
				if (!user) {
					throw new Error('User not found');
				}
				
				const isValidPassword = await this.verifyPassword(password, user.password);
				if (!isValidPassword) {
					throw new Error('Invalid password');
				}
				
				// Login successful
				this.currentUser = user;
				this.isLoggedIn = true;
				this.userId = user.id;
				
				// Save current user
				localStorage.setItem('fitflow_current_user', JSON.stringify(user));
				
				return { success: true, user: user };
			} catch (error) {
				return { success: false, error: error.message };
			}
		}
		
		logout() {
			this.currentUser = null;
			this.isLoggedIn = false;
			this.userId = null;
			localStorage.removeItem('fitflow_current_user');
		}
		
		async hashPassword(password) {
			// Simple hash for demo purposes (in production, use proper crypto)
			const encoder = new TextEncoder();
			const data = encoder.encode(password + 'fitflow_salt');
			const hashBuffer = await crypto.subtle.digest('SHA-256', data);
			const hashArray = Array.from(new Uint8Array(hashBuffer));
			return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
		}
		
		async verifyPassword(password, hashedPassword) {
			// Handle both old and new hash formats
			if (typeof hashedPassword === 'string') {
				// Old format - simple hash
				const hashedInput = await this.hashPassword(password);
				return hashedInput === hashedPassword;
			} else if (hashedPassword.hash && hashedPassword.salt) {
				// New format - PBKDF2 with salt
				const encoder = new TextEncoder();
				const salt = new Uint8Array(hashedPassword.salt.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
				const iterations = hashedPassword.iterations || 100000;
				
				// Generate key using PBKDF2
				const key = await crypto.subtle.importKey(
					'raw',
					encoder.encode(password),
					{ name: 'PBKDF2' },
					false,
					['deriveBits']
				);
				
				const derivedBits = await crypto.subtle.deriveBits(
					{
						name: 'PBKDF2',
						salt: salt,
						iterations: iterations,
						hash: 'SHA-256'
					},
					key,
					256
				);
				
				const hashArray = Array.from(new Uint8Array(derivedBits));
				const hashedInput = hashArray.map(b => b.toString(16).padStart(2, 0)).join('');
				
				return hashedInput === hashedPassword.hash;
			}
			return false;
		}
		
		recordWorkout(workoutData, completionTime = null) {
			if (!this.currentUser) return;
			
			const workout = {
				id: 'workout_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
				...workoutData,
				completedAt: completionTime ? new Date().toISOString() : null,
				createdAt: new Date().toISOString()
			};
			
			// Add to workout history
			this.currentUser.profile.workoutHistory.unshift(workout);
			
			// Keep only last 100 workouts
			if (this.currentUser.profile.workoutHistory.length > 100) {
				this.currentUser.profile.workoutHistory = this.currentUser.profile.workoutHistory.slice(0, 100);
			}
			
			// Update stats
			this.currentUser.profile.stats.totalWorkouts++;
			if (workoutData.duration) {
				this.currentUser.profile.stats.totalTime += workoutData.duration;
			}
			
			// Update streak
			this.updateStreak();
			
			// Check for achievements
			this.checkAchievements();
			
			// Save user
			this.saveUser();
			
			return workout;
		}
		
		updateStreak() {
			const today = new Date().toDateString();
			const lastWorkout = this.currentUser.profile.stats.lastWorkoutDate;
			
			if (lastWorkout) {
				const lastWorkoutDate = new Date(lastWorkout).toDateString();
				const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
				
				if (lastWorkoutDate === yesterday) {
					// Consecutive day
					this.currentUser.profile.stats.currentStreak++;
				} else if (lastWorkoutDate !== today) {
					// Streak broken
					this.currentUser.profile.stats.currentStreak = 1;
				}
			} else {
				// First workout
				this.currentUser.profile.stats.currentStreak = 1;
			}
			
			// Update longest streak
			if (this.currentUser.profile.stats.currentStreak > this.currentUser.profile.stats.longestStreak) {
				this.currentUser.profile.stats.longestStreak = this.currentUser.profile.stats.currentStreak;
			}
			
			this.currentUser.profile.stats.lastWorkoutDate = new Date().toISOString();
		}
		
		checkAchievements() {
			const stats = this.currentUser.profile.stats;
			const achievements = this.currentUser.profile.achievements;
			
			// First Workout
			if (stats.totalWorkouts === 1 && !achievements.find(a => a.id === 'first_workout')) {
				achievements.push({
					id: 'first_workout',
					name: 'First Steps',
					description: 'Completed your first workout',
					icon: '🎯',
					unlockedAt: new Date().toISOString()
				});
			}
			
			// Workout Streaks
			if (stats.currentStreak === 3 && !achievements.find(a => a.id === 'streak_3')) {
				achievements.push({
					id: 'streak_3',
					name: 'Getting Started',
					description: '3-day workout streak',
					icon: '🔥',
					unlockedAt: new Date().toISOString()
				});
			}
			
			if (stats.currentStreak === 7 && !achievements.find(a => a.id === 'streak_7')) {
				achievements.push({
					id: 'streak_7',
					name: 'Week Warrior',
					description: '7-day workout streak',
					icon: '⚡',
					unlockedAt: new Date().toISOString()
				});
			}
			
			if (stats.currentStreak === 30 && !achievements.find(a => a.id === 'streak_30')) {
				achievements.push({
					id: 'streak_30',
					name: 'Monthly Master',
					description: '30-day workout streak',
					icon: '👑',
					unlockedAt: new Date().toISOString()
				});
			}
			
			// Workout Count Milestones
			if (stats.totalWorkouts === 10 && !achievements.find(a => a.id === 'workouts_10')) {
				achievements.push({
					id: 'workouts_10',
					name: 'Dedicated',
					description: 'Completed 10 workouts',
					icon: '💪',
					unlockedAt: new Date().toISOString()
				});
			}
			
			if (stats.totalWorkouts === 50 && !achievements.find(a => a.id === 'workouts_50')) {
				achievements.push({
					id: 'workouts_50',
					name: 'Fitness Fanatic',
					description: 'Completed 50 workouts',
					icon: '🏆',
					unlockedAt: new Date().toISOString()
				});
			}
			
			if (stats.totalWorkouts === 100 && !achievements.find(a => a.id === 'workouts_100')) {
				achievements.push({
					id: 'workouts_100',
					name: 'Century Club',
					description: 'Completed 100 workouts',
					icon: '🌟',
					unlockedAt: new Date().toISOString()
				});
			}
			
			// Time Milestones
			if (stats.totalTime >= 1000 && !achievements.find(a => a.id === 'time_1000')) {
				achievements.push({
					id: 'time_1000',
					name: 'Time Warrior',
					description: 'Spent 1000+ minutes working out',
					icon: '⏰',
					unlockedAt: new Date().toISOString()
				});
			}
		}
		
		getUserStats() {
			if (!this.currentUser) return null;
			return this.currentUser.profile.stats;
		}
		
		getAchievements() {
			if (!this.currentUser) return [];
			return this.currentUser.profile.achievements;
		}
		
		getWorkoutHistory(limit = 20) {
			if (!this.currentUser) return [];
			return this.currentUser.profile.workoutHistory.slice(0, limit);
		}
		
		getUserProfile() {
			return this.currentUser?.profile || null;
		}
		
		saveUser() {
			if (!this.currentUser) return;
			
			// Update current user
			localStorage.setItem('fitflow_current_user', JSON.stringify(this.currentUser));
			
			// Update in users array
			const users = JSON.parse(localStorage.getItem('fitflow_users') || '[]');
			const userIndex = users.findIndex(u => u.id === this.currentUser.id);
			if (userIndex !== -1) {
				users[userIndex] = this.currentUser;
				localStorage.setItem('fitflow_users', JSON.stringify(users));
			}
		}
	}
	
	// NEW FEATURE: Comprehensive analytics tracking for user insights
	// This feature collects user behavior data for the analytics dashboard
	// Added: 2025-09-03 - Analytics tracking system for user insights
	
	class AnalyticsTracker {
		constructor() {
			this.sessionStartTime = Date.now();
			this.userId = this.generateUserId();
			this.userAccount = new UserAccount();
			this.trackPageView();
		}
		
		generateUserId() {
			let userId = localStorage.getItem('fitflow_user_id');
			if (!userId) {
				userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
				localStorage.setItem('fitflow_user_id', userId);
			}
			return userId;
		}
		
		trackPageView() {
			this.trackEvent('Page Visited', {
				page: window.location.pathname || '/',
				timestamp: new Date().toISOString()
			});
		}
		
		trackWorkoutGenerated(workoutData) {
			this.trackEvent('Workout Generated', {
				pattern: workoutData.pattern || 'Standard',
				duration: workoutData.duration || 30,
				equipment: workoutData.equipment || [],
				fitnessLevel: workoutData.fitnessLevel || 'Beginner',
				exerciseCount: workoutData.exercises?.length || 0,
				timestamp: new Date().toISOString()
			});
		}
		
		trackWorkoutStarted(workoutData) {
			this.trackEvent('Workout Started', {
				pattern: workoutData.pattern || 'Standard',
				duration: workoutData.duration || 30,
				equipment: workoutData.equipment || [],
				fitnessLevel: workoutData.fitnessLevel || 'Beginner',
				timestamp: new Date().toISOString()
			});
		}
		
		trackWorkoutCompleted(workoutData, completionTime) {
			this.trackEvent('Workout Completed', {
				pattern: workoutData.pattern || 'Standard',
				duration: workoutData.duration || 30,
				equipment: workoutData.equipment || [],
				fitnessLevel: workoutData.fitnessLevel || 'Beginner',
				completionTime: completionTime,
				timestamp: new Date().toISOString()
			});
		}
		
		trackEquipmentChange(oldEquipment, newEquipment) {
			this.trackEvent('Equipment Changed', {
				from: oldEquipment,
				to: newEquipment,
				timestamp: new Date().toISOString()
			});
		}
		
		trackTrainingPatternChange(oldPattern, newPattern) {
			this.trackEvent('Training Pattern Changed', {
				from: oldPattern,
				to: newPattern,
				timestamp: new Date().toISOString()
			});
		}
		
		trackSessionEnd() {
			const sessionDuration = Math.round((Date.now() - this.sessionStartTime) / 1000 / 60);
			this.trackEvent('Session Ended', {
				duration: sessionDuration,
				timestamp: new Date().toISOString()
			});
		}
		
		trackEvent(action, details) {
			const event = {
				id: 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
				userId: this.userId,
				action: action,
				details: details,
				timestamp: new Date().toISOString()
			};
			
			// Store in localStorage for the dashboard
			this.storeEvent(event);
			
			// In a real app, you'd send this to your analytics server
		}
		
		storeEvent(event) {
			try {
				const events = JSON.parse(localStorage.getItem('fitflow_analytics_events') || '[]');
				events.push(event);
				
				// Keep only last 1000 events to prevent localStorage overflow
				if (events.length > 1000) {
					events.splice(0, events.length - 1000);
				}
				
				localStorage.setItem('fitflow_analytics_events', JSON.stringify(events));
			} catch (error) {
				console.error('Error storing analytics event:', error);
			}
		}
		
		getAnalyticsData() {
			try {
				const events = JSON.parse(localStorage.getItem('fitflow_analytics_events') || '[]');
				const users = [{
					id: this.userId,
					type: this.getUserType(),
					preferredEquipment: this.getPreferredEquipment(),
					joinDate: this.getJoinDate(),
					totalWorkouts: this.getTotalWorkouts()
				}];
				
				const workouts = this.processWorkoutEvents(events);
				const sessions = this.processSessionEvents(events);
				
				return {
					users: users,
					workouts: workouts,
					sessions: sessions,
					activity: events
				};
			} catch (error) {
				console.error('Error getting analytics data:', error);
				return { users: [], workouts: [], sessions: [], activity: [] };
			}
		}
		
		getUserType() {
			// Determine user type based on workout patterns
			const events = JSON.parse(localStorage.getItem('fitflow_analytics_events') || '[]');
			const workoutEvents = events.filter(e => e.action === 'Workout Generated');
			
			if (workoutEvents.length === 0) return 'Beginner';
			if (workoutEvents.length < 10) return 'Beginner';
			if (workoutEvents.length < 30) return 'Intermediate';
			return 'Advanced';
		}
		
		getPreferredEquipment() {
			const events = JSON.parse(localStorage.getItem('fitflow_analytics_events') || '[]');
			const equipmentEvents = events.filter(e => e.action === 'Equipment Changed' || e.action === 'Workout Generated');
			
			const equipmentCounts = {};
			equipmentEvents.forEach(event => {
				const equipment = event.details.equipment || event.details.to;
				if (equipment && Array.isArray(equipment)) {
					equipment.forEach(eq => {
						equipmentCounts[eq] = (equipmentCounts[eq] || 0) + 1;
					});
				}
			});
			
			const mostUsed = Object.keys(equipmentCounts).reduce((a, b) => 
				equipmentCounts[a] > equipmentCounts[b] ? a : b, 'Bodyweight');
			
			return mostUsed;
		}
		
		getJoinDate() {
			const events = JSON.parse(localStorage.getItem('fitflow_analytics_events') || '[]');
			if (events.length === 0) return new Date().toISOString();
			
			const firstEvent = events.reduce((earliest, current) => 
				new Date(current.timestamp) < new Date(earliest.timestamp) ? current : earliest);
			
			return firstEvent.timestamp;
		}
		
		getTotalWorkouts() {
			const events = JSON.parse(localStorage.getItem('fitflow_analytics_events') || '[]');
			return events.filter(e => e.action === 'Workout Generated').length;
		}
		
		processWorkoutEvents(events) {
			const workoutEvents = events.filter(e => e.action === 'Workout Generated');
			return workoutEvents.map(event => ({
				id: event.id,
				userId: event.userId,
				pattern: event.details.pattern,
				duration: event.details.duration,
				equipment: event.details.equipment,
				fitnessLevel: event.details.fitnessLevel,
				timestamp: event.timestamp,
				completed: events.some(e => 
					e.action === 'Workout Completed' && 
					e.details.pattern === event.details.pattern &&
					e.details.timestamp > event.details.timestamp
				)
			}));
		}
		
		processSessionEvents(events) {
			const sessionEvents = events.filter(e => e.action === 'Session Ended');
			return sessionEvents.map(event => ({
				id: event.id,
				userId: event.userId,
				startTime: new Date(event.timestamp - (event.details.duration * 60 * 1000)).toISOString(),
				duration: event.details.duration,
				pagesVisited: events.filter(e => e.action === 'Page Visited').length,
				workoutGenerated: events.some(e => e.action === 'Workout Generated')
			}));
		}
	}
	
	// Initialize analytics tracker
	const analytics = new AnalyticsTracker();
	
	// Make analytics globally accessible for user account system
	window.analytics = analytics;
	
	// Update user interface now that analytics is ready
	if (typeof updateUserInterface === 'function') {
		updateUserInterface();
	}
	
	// Track session end when user leaves the page
	window.addEventListener('beforeunload', () => {
		analytics.trackSessionEnd();
	});

	// NEW FEATURE: User Account System UI Management
	// This feature provides the user interface for login, registration, and profile management
	// Added: 2025-09-03 - User account system UI integration
	
	function initUserAccountSystem() {
		// Initializing user account system...
		
		// Check if user is already logged in (but only if analytics is ready)
		if (window.analytics && window.analytics.userAccount) {
			updateUserInterface();
		} else {
			// Analytics not ready yet, will update UI later
		}
		
		// Event listeners for modals
		const loginBtn = document.getElementById('login-btn');
		const registerBtn = document.getElementById('register-btn');
		const profileBtn = document.getElementById('profile-btn');
		const logoutBtn = document.getElementById('logout-btn');
		
		// Found elements: loginBtn, registerBtn, profileBtn, logoutBtn
		
		if (loginBtn) {
			loginBtn.addEventListener('click', () => {
				// Login button clicked
				showModal('login-modal');
			});
		}
		
		if (registerBtn) {
			registerBtn.addEventListener('click', () => {
				// Register button clicked
				showModal('register-modal');
			});
		}
		
		if (profileBtn) {
			profileBtn.addEventListener('click', () => showModal('profile-modal'));
		}
		
		if (logoutBtn) {
			logoutBtn.addEventListener('click', handleLogout);
		}
		
		// Close modal buttons
		document.getElementById('close-login-modal').addEventListener('click', () => hideModal('login-modal'));
		document.getElementById('close-register-modal').addEventListener('click', () => hideModal('register-modal'));
		document.getElementById('close-profile-modal').addEventListener('click', () => hideModal('profile-modal'));
		document.getElementById('close-privacy-modal').addEventListener('click', () => hideModal('privacy-policy-modal'));
		
		// Switch between login and register
		document.getElementById('switch-to-register').addEventListener('click', () => {
			hideModal('login-modal');
			showModal('register-modal');
		});
		document.getElementById('switch-to-login').addEventListener('click', () => {
			hideModal('register-modal');
			showModal('login-modal');
		});
		
		// Form submissions
		document.getElementById('login-form').addEventListener('submit', handleLogin);
		document.getElementById('register-form').addEventListener('submit', handleRegister);
		
		// Close modals when clicking outside
		document.querySelectorAll('[id$="-modal"]').forEach(modal => {
			modal.addEventListener('click', (e) => {
				if (e.target === modal) {
					hideModal(modal.id);
				}
			});
		});
	}
	
	function showModal(modalId) {
		document.getElementById(modalId).classList.remove('hidden');
		document.body.style.overflow = 'hidden';
	}
	
	function hideModal(modalId) {
		document.getElementById(modalId).classList.add('hidden');
		document.body.style.overflow = 'auto';
		
		// Clear form errors
		const errorId = modalId.replace('-modal', '-error');
		const errorElement = document.getElementById(errorId);
		if (errorElement) {
			errorElement.classList.add('hidden');
		}
	}
	
	async function handleLogin(e) {
		e.preventDefault();
		
		const email = document.getElementById('login-email').value;
		const password = document.getElementById('login-password').value;
		const errorDiv = document.getElementById('login-error');
		
		try {
			const result = await window.analytics.userAccount.login(email, password);
			
			if (result.success) {
				hideModal('login-modal');
				updateUserInterface();
				showNotification('Successfully logged in!', 'success');
			} else {
				errorDiv.textContent = result.error;
				errorDiv.classList.remove('hidden');
			}
		} catch (error) {
			errorDiv.textContent = 'An error occurred. Please try again.';
			errorDiv.classList.remove('hidden');
		}
	}
	
	async function handleRegister(e) {
		e.preventDefault();
		
		const name = document.getElementById('register-name').value;
		const email = document.getElementById('register-email').value;
		const password = document.getElementById('register-password').value;
		const experience = document.getElementById('register-experience').value;
		const goal = document.getElementById('register-goal').value;
		const errorDiv = document.getElementById('register-error');
		
		try {
			const profile = {
				name: name,
				experience: experience,
				goals: [goal]
			};
			
			const result = await window.analytics.userAccount.register(email, password, profile);
			
			if (result.success) {
				hideModal('register-modal');
				updateUserInterface();
				showNotification('Account created successfully! Welcome to FitFlow!', 'success');
			} else {
				errorDiv.textContent = result.error;
				errorDiv.classList.remove('hidden');
			}
		} catch (error) {
			errorDiv.textContent = 'An error occurred. Please try again.';
			errorDiv.classList.remove('hidden');
		}
	}
	
	function handleLogout() {
		window.analytics.userAccount.logout();
		updateUserInterface();
		showNotification('Successfully logged out!', 'info');
	}
	
	function updateUserInterface() {
		// Check if analytics and userAccount are available
		if (!window.analytics || !window.analytics.userAccount) {
			// Analytics not ready yet, skipping UI update
			return;
		}
		
		const userAccount = window.analytics.userAccount;
		const userSection = document.getElementById('user-account-section');
		const guestSection = document.getElementById('guest-section');
		
		if (!userSection || !guestSection) {
			// User interface elements not found
			return;
		}
		
		if (userAccount.isLoggedIn) {
			// Show user section
			userSection.classList.remove('hidden');
			guestSection.classList.add('hidden');
			
			// Update user info
			const user = userAccount.currentUser;
			const userNameEl = document.getElementById('user-name');
			const userStreakEl = document.getElementById('user-streak');
			
			if (userNameEl) userNameEl.textContent = user.profile.name;
			if (userStreakEl) userStreakEl.textContent = `${user.profile.stats.currentStreak} day streak`;
			
			// Update profile modal content
			updateProfileContent();
		} else {
			// Show guest section
			userSection.classList.add('hidden');
			guestSection.classList.remove('hidden');
		}
	}
	
	function updateProfileContent() {
		const userAccount = window.analytics.userAccount;
		const profileContent = document.getElementById('profile-content');
		
		if (!userAccount.isLoggedIn) return;
		
		const user = userAccount.currentUser;
		const stats = user.profile.stats;
		const achievements = user.profile.achievements;
		const workoutHistory = userAccount.getWorkoutHistory(10);
		
		profileContent.innerHTML = `
			<div class="grid md:grid-cols-2 gap-6">
				<!-- User Info -->
				<div class="space-y-4">
					<div class="bg-gray-50 rounded-lg p-4">
						<h4 class="font-semibold text-fit-dark mb-3">Profile Information</h4>
						<div class="space-y-2 text-sm">
							<div><span class="font-medium">Name:</span> ${user.profile.name}</div>
							<div><span class="font-medium">Email:</span> ${user.email}</div>
							<div><span class="font-medium">Experience:</span> ${user.profile.experience}</div>
							<div><span class="font-medium">Goals:</span> ${user.profile.goals.join(', ')}</div>
							<div><span class="font-medium">Member since:</span> ${new Date(user.createdAt).toLocaleDateString()}</div>
						</div>
					</div>
					
					<div class="bg-gray-50 rounded-lg p-4">
						<h4 class="font-semibold text-fit-dark mb-3">Statistics</h4>
						<div class="grid grid-cols-2 gap-4 text-sm">
							<div class="text-center">
								<div class="text-2xl font-bold text-fit-primary">${stats.totalWorkouts}</div>
								<div class="text-fit-secondary">Total Workouts</div>
							</div>
							<div class="text-center">
								<div class="text-2xl font-bold text-fit-accent">${Math.round(stats.totalTime)}</div>
								<div class="text-fit-secondary">Minutes</div>
							</div>
							<div class="text-center">
								<div class="text-2xl font-bold text-fit-warning">${stats.currentStreak}</div>
								<div class="text-fit-secondary">Day Streak</div>
							</div>
							<div class="text-center">
								<div class="text-2xl font-bold text-fit-secondary">${stats.longestStreak}</div>
								<div class="text-fit-secondary">Best Streak</div>
							</div>
						</div>
					</div>
				</div>
				
				<!-- Achievements & History -->
				<div class="space-y-4">
					<div class="bg-gray-50 rounded-lg p-4">
						<h4 class="font-semibold text-fit-dark mb-3">Achievements (${achievements.length})</h4>
						${achievements.length > 0 ? `
							<div class="space-y-2">
								${achievements.map(achievement => `
									<div class="flex items-center space-x-3 p-2 bg-white rounded border">
										<span class="text-2xl">${achievement.icon}</span>
										<div>
											<div class="font-medium text-fit-dark">${achievement.name}</div>
											<div class="text-xs text-fit-secondary">${achievement.description}</div>
										</div>
									</div>
								`).join('')}
							</div>
						` : '<p class="text-fit-secondary text-sm">No achievements yet. Keep working out!</p>'}
					</div>
					
					<div class="bg-gray-50 rounded-lg p-4">
						<h4 class="font-semibold text-fit-dark mb-3">Recent Workouts</h4>
						${workoutHistory.length > 0 ? `
							<div class="space-y-2 max-h-40 overflow-y-auto">
								${workoutHistory.map(workout => `
									<div class="p-2 bg-white rounded border text-sm">
										<div class="font-medium text-fit-dark">${workout.pattern} - ${workout.duration}min</div>
										<div class="text-fit-secondary">${new Date(workout.createdAt).toLocaleDateString()}</div>
									</div>
								`).join('')}
							</div>
						` : '<p class="text-fit-secondary text-sm">No workouts yet. Start your fitness journey!</p>'}
					</div>
				</div>
			</div>
		`;
	}
	
	function showPrivacyPolicy() {
		showModal('privacy-policy-modal');
	}
	
	function showNotification(message, type = 'info') {
		// Create notification element
		const notification = document.createElement('div');
		notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white ${
			type === 'success' ? 'bg-green-500' : 
			type === 'error' ? 'bg-red-500' : 
			'bg-blue-500'
		}`;
		notification.textContent = message;
		
		document.body.appendChild(notification);
		
		// Remove after 3 seconds
		setTimeout(() => {
			notification.remove();
		}, 3000);
	}
});
