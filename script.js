// --- FINAL IMPROVED WORKOUT GENERATOR ---
// Enhanced version with detailed exercise descriptions and safety guidelines

// --- ENHANCED EXERCISE DATABASE WITH SAFETY GUIDELINES ---
const exercises = [
    // Warm-up exercises
    { 
        name: "Arm Circles", 
        description: "Stand with feet shoulder-width apart. Start with small circles, gradually increasing size. Circle forward for 10 reps, then backward for 10 reps. Keep shoulders relaxed and avoid shrugging. ⚠️ DO: Start small and controlled. DON'T: Force large circles or shrug shoulders. Stop if you feel shoulder pain.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Shoulders", 
        type: "warmup" 
    },
    { 
        name: "Leg Swings", 
        description: "Hold onto a wall or sturdy surface for balance. Swing one leg forward and back in a controlled motion, keeping the movement smooth. Do 10-15 swings per leg, then switch. ⚠️ DO: Keep upper body stable, swing from hip joint. DON'T: Swing too fast or let momentum take over. Stop if you feel hip or knee pain.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "warmup" 
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
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "main" 
    },
    { 
        name: "Push-ups", 
        description: "Start in plank position, hands slightly wider than shoulders. Lower chest toward floor, keeping body straight. Push back up to start. Beginners: keep knees on ground. ⚠️ DO: Keep body straight, lower chest not head, breathe rhythmically. DON'T: Let hips sag, touch floor with face, or hold breath.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Chest", 
        type: "main" 
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
    }
];

// --- HELPER FUNCTIONS ---
function validateForm() {
    const level = document.getElementById('fitness-level').value;
    const mainDuration = parseInt(document.getElementById('duration').value);
    const workTime = parseInt(document.getElementById('work-time').value);
    const restTime = parseInt(document.getElementById('rest-time').value);
    const equipmentCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    
    // Validate fitness level
    if (!['Beginner', 'Intermediate', 'Advanced'].includes(level)) {
        throw new Error('Invalid fitness level selected');
    }
    
    // Validate duration
    if (isNaN(mainDuration) || mainDuration < 10 || mainDuration > 60) {
        throw new Error('Invalid duration selected');
    }
    
    // Validate work time
    if (isNaN(workTime) || workTime < 15 || workTime > 60) {
        throw new Error('Invalid work time selected');
    }
    
    // Validate rest time
    if (isNaN(restTime) || restTime < 15 || restTime > 60) {
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
    errorDiv.className = 'fixed top-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    errorDiv.innerHTML = `
        <div class="flex items-center">
            <span class="mr-2">❌</span>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">×</button>
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
    successDiv.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    successDiv.innerHTML = `
        <div class="flex items-center">
            <span class="mr-2">✅</span>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">×</button>
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
    generateBtn.classList.toggle('opacity-50', isLoading);
    generateBtn.classList.toggle('cursor-not-allowed', isLoading);
}

function generateRandomSet(exerciseList, count) {
    if (exerciseList.length === 0) return [];
    const shuffled = [...exerciseList].sort(() => 0.5 - Math.random());
    const numToReturn = Math.min(count, shuffled.length);
    return shuffled.slice(0, numToReturn);
}

function displayPlan(warmup, main, cooldown, summary, workTime, restTime) {
    const planContentDiv = document.getElementById('plan-content');
    const workoutPlanDiv = document.getElementById('workout-plan');
    const noResultsDiv = document.getElementById('no-results');
    
    // Clear content safely
    planContentDiv.textContent = '';
    
    if (!main || main.length === 0) {
        workoutPlanDiv.classList.add('hidden');
        noResultsDiv.classList.remove('hidden');
        return;
    }
    
    noResultsDiv.classList.add('hidden');
    workoutPlanDiv.classList.remove('hidden');

    const createSection = (title, exercises) => {
        if (!exercises || exercises.length === 0) return '';
        let sectionHtml = `<h2 class="text-2xl font-bold text-center text-blue-400 my-6">${title}</h2>`;
        exercises.forEach((exercise) => {
            // Split description into instruction and safety parts
            const descriptionParts = exercise.description.split('⚠️');
            const instruction = descriptionParts[0].trim();
            const safetyGuidelines = descriptionParts[1] ? descriptionParts[1].trim() : '';
            
            // Split safety guidelines into DO's and DON'Ts
            let doSection = '';
            let dontSection = '';
            if (safetyGuidelines) {
                const doMatch = safetyGuidelines.match(/DO: (.+?)\. DON'T:/);
                const dontMatch = safetyGuidelines.match(/DON'T: (.+)/);
                
                if (doMatch) doSection = doMatch[1].trim();
                if (dontMatch) dontSection = dontMatch[1].trim();
            }
            
            sectionHtml += `
                <div class="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 shadow-md animate-fade-in mb-6">
                    <div class="p-6">
                        <h3 class="text-xl font-bold text-blue-300 mb-3">${exercise.name}</h3>
                        
                        <!-- Exercise Instructions -->
                        <div class="mb-4">
                            <h4 class="text-lg font-semibold text-white mb-2">📋 Instructions:</h4>
                            <p class="text-gray-300 leading-relaxed">${instruction}</p>
                        </div>
                        
                        <!-- Safety Guidelines -->
                        ${safetyGuidelines ? `
                        <div class="mb-4">
                            <h4 class="text-lg font-semibold text-white mb-2">⚠️ Safety Guidelines:</h4>
                            ${doSection ? `
                            <div class="bg-green-900/20 border border-green-700 rounded-lg p-3 mb-2">
                                <h5 class="text-green-400 font-semibold mb-1">✅ DO:</h5>
                                <p class="text-green-300 text-sm">${doSection}</p>
                            </div>
                            ` : ''}
                            ${dontSection ? `
                            <div class="bg-red-900/20 border border-red-700 rounded-lg p-3 mb-2">
                                <h5 class="text-red-400 font-semibold mb-1">❌ DON'T:</h5>
                                <p class="text-red-300 text-sm">${dontSection}</p>
                            </div>
                            ` : ''}
                        </div>
                        ` : ''}
                        
                        <!-- Exercise Details -->
                        <div class="mt-4 flex flex-wrap gap-2">
                            <div class="bg-gray-700 inline-block px-4 py-2 rounded-full text-sm font-semibold">
                                <span class="text-white">Duration: </span>
                                <span class="text-blue-300">${workTime} sec work, ${restTime} sec rest</span>
                            </div>
                            <div class="bg-gray-700 inline-block px-4 py-2 rounded-full text-sm font-semibold">
                                <span class="text-white">Muscle: </span>
                                <span class="text-green-300">${exercise.muscle}</span>
                            </div>
                            <div class="bg-gray-700 inline-block px-4 py-2 rounded-full text-sm font-semibold">
                                <span class="text-white">Equipment: </span>
                                <span class="text-yellow-300">${exercise.equipment}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        return sectionHtml;
    };

    const summaryHtml = `<div class="text-center text-blue-300 bg-gray-800 p-4 rounded-lg mb-8 border border-gray-700">${summary}</div>`;

    // Create content safely using a temporary container
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = createSection("Warm-up (5 Minutes)", warmup);
    tempContainer.innerHTML += `<h2 class="text-2xl font-bold text-center text-blue-400 my-6">Main Workout (${main.length} Minutes)</h2>` + summaryHtml;
    tempContainer.innerHTML += createSection("", main);
    tempContainer.innerHTML += createSection("Cool-down (5 Minutes)", cooldown);
    
    // Move all children to the actual container
    while (tempContainer.firstChild) {
        planContentDiv.appendChild(tempContainer.firstChild);
    }

    workoutPlanDiv.scrollIntoView({ behavior: 'smooth' });
}

// --- MAIN INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
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
                const mainDuration = parseInt(durationSlider.value);
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

                // FIXED: Improved logic - only check if we have enough exercises for the requested duration
                if (availableMain.length === 0) {
                    throw new Error('No exercises available for the selected criteria. Please try different equipment or fitness level.');
                }

                // Use fallback plan if AI is not available
                const fallbackMainPlan = generateRandomSet(availableMain, mainDuration);
                displayPlan(warmupPlan, fallbackMainPlan, cooldownPlan, `Generated ${mainDuration}-minute workout plan with ${selectedEquipment.join(', ')} equipment.`, workTime, restTime);
                
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
    
    // Add ARIA labels and roles
    if (generateBtn) {
        generateBtn.setAttribute('aria-label', 'Generate workout plan');
        generateBtn.setAttribute('role', 'button');
    }
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.tagName === 'SELECT') {
            e.target.blur();
        }
    });
    
    // Add focus indicators
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
    
    // Add keyboard navigation for equipment checkboxes
    const equipmentLabels = document.querySelectorAll('label[for^="eq-"]');
    equipmentLabels.forEach(label => {
        label.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const checkbox = document.getElementById(label.getAttribute('for'));
                if (checkbox) {
                    checkbox.checked = !checkbox.checked;
                    label.setAttribute('aria-checked', checkbox.checked.toString());
                    // Trigger change event
                    const event = new Event('change', { bubbles: true });
                    checkbox.dispatchEvent(event);
                }
            }
        });
        
        // Update aria-checked attribute when checkbox changes
        const checkbox = document.getElementById(label.getAttribute('for'));
        if (checkbox) {
            checkbox.addEventListener('change', () => {
                label.setAttribute('aria-checked', checkbox.checked.toString());
            });
        }
    });
});
