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
    
    // Additional Warm-up Exercises (5-minute warm-up)
    { 
        name: "Arm Circles", 
        description: "Stand with arms extended to sides. Make small circles forward for 10 reps, then backward for 10 reps. Gradually increase circle size. ⚠️ DO: Keep movements controlled, start small and increase range. DON'T: Force large circles if shoulders are tight, or continue if you feel shoulder pain.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Shoulders", 
        type: "warmup" 
    },
    { 
        name: "Leg Swings", 
        description: "Hold onto a wall or sturdy surface for balance. Swing one leg forward and backward, then side to side. Do 10 swings each direction per leg. ⚠️ DO: Keep standing leg stable, swing from hip, control the movement. DON'T: Let momentum take over, swing too hard, or lose balance.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "warmup" 
    },
    { 
        name: "Scapular Pulls", 
        description: "Hang from a bar with straight arms and pull shoulder blades down and back. Hold for 2 seconds, then release. Do 10-15 reps. ⚠️ DO: Keep arms straight and control the movement. DON'T: Swing or bend elbows.", 
        equipment: "Pull-up Bar", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "warmup" 
    },
    { 
        name: "Hip Openers (Lunge + Circle)", 
        description: "Step into a forward lunge, gently circle the front hip in both directions. Do 5 circles each direction, then switch legs. ⚠️ DO: Keep movements gentle and controlled, feel hip mobility. DON'T: Force deep angles or twist the knee.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "warmup" 
    },
    { 
        name: "Walking Lunges", 
        description: "Step forward into a lunge, then bring back leg forward into next lunge. Continue walking forward with controlled lunges. Do 10-15 lunges total. ⚠️ DO: Keep chest up, control the movement, land softly. DON'T: Let knee go past toes, round back, or rush the movement.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "warmup" 
    },
    { 
        name: "Bear Crawl", 
        description: "Start on hands and knees, lift knees 1-2 inches off ground. Crawl forward by moving opposite hand and foot together. Keep core tight and back flat. ⚠️ DO: Keep core engaged, maintain flat back, move slowly. DON'T: Pike hips or let knees drag.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "warmup" 
    },
    { 
        name: "Mountain Climbers", 
        description: "Start in plank position. Alternate bringing knees toward chest in running motion. Keep core tight and maintain plank position. ⚠️ DO: Keep hips level, maintain plank form, control the movement. DON'T: Let hips lift, move too fast, or sacrifice form for speed.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "warmup" 
    },
    { 
        name: "Jumping Jacks", 
        description: "Start standing with feet together and arms at sides. Jump feet apart while raising arms overhead, then jump back to start. ⚠️ DO: Land softly, maintain rhythm, breathe normally. DON'T: Land hard, hold breath, or jump too high if you have joint issues.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "warmup" 
    },
    { 
        name: "Reverse Lunges", 
        description: "Step one leg back and lower until both knees hit ~90 degrees. Push back to start and repeat. Do 10-15 reps per leg. ⚠️ DO: Keep chest up, control the movement, land softly. DON'T: Let front knee cave or slam the back knee.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "warmup" 
    },
    { 
        name: "Plank to Downward Dog", 
        description: "Start in plank position. Push hips up and back into downward dog, then return to plank. Move slowly and controlled. ⚠️ DO: Keep core engaged, move with control, feel the stretch. DON'T: Rush the movement, let hips sag, or lose form.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Full Body", 
        type: "warmup" 
    },
    
    // Additional Cool-down Exercises (5-minute cool-down)
    { 
        name: "Seated Forward Fold", 
        description: "Sit tall with legs extended; hinge forward from hips, reaching for feet or shins. Hold 30-60 seconds, breathing deeply. ⚠️ DO: Hinge from hips, keep back straight, breathe deeply. DON'T: Bounce or round aggressively.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "cooldown" 
    },
    { 
        name: "Quad Stretch", 
        description: "Stand on one leg, bend other knee and grab foot behind you. Pull heel toward glutes gently. Hold 30 seconds per side. ⚠️ DO: Keep standing leg soft, pull gently, maintain balance. DON'T: Force the stretch, hold breath, or lose balance.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "cooldown" 
    },
    { 
        name: "Wall Chest Stretch", 
        description: "Stand facing wall, place forearm against wall at shoulder height. Gently turn body away from wall to feel chest stretch. Hold 30 seconds per side. ⚠️ DO: Keep shoulder relaxed, breathe deeply, feel gentle stretch. DON'T: Force the stretch or continue if you feel shoulder pain.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Chest", 
        type: "cooldown" 
    },
    { 
        name: "Seated Spinal Twist", 
        description: "Sit with legs extended, bend one knee and place foot outside opposite thigh. Twist torso toward bent knee, placing opposite elbow outside knee. Hold 30 seconds per side. ⚠️ DO: Keep spine tall, breathe deeply, feel gentle twist. DON'T: Force the twist or round back.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "cooldown" 
    },
    { 
        name: "Standing Forward Fold", 
        description: "Stand with feet hip-width apart, hinge forward from hips and let arms hang. Hold 30-60 seconds, breathing deeply. ⚠️ DO: Hinge from hips, keep knees soft, breathe deeply. DON'T: Bounce or force the stretch.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "cooldown" 
    },
    { 
        name: "Reclined Butterfly", 
        description: "Lie on back, bring soles of feet together and let knees fall open. Place hands on belly and breathe deeply. Hold 60-90 seconds. ⚠️ DO: Relax into the stretch, breathe deeply, let gravity work. DON'T: Force knees down or hold breath.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "cooldown" 
    },
    { 
        name: "Supine Twist", 
        description: "Lie on back, bring knees to chest, then let them fall to one side while keeping shoulders on floor. Hold 30 seconds per side. ⚠️ DO: Keep shoulders down, breathe deeply, feel gentle twist. DON'T: Force the twist or lift shoulders.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "cooldown" 
    },
    { 
        name: "Happy Baby", 
        description: "Lie on back, bring knees to chest and grab outside of feet. Gently rock side to side while holding feet. Hold 30-60 seconds. ⚠️ DO: Keep lower back on floor, breathe deeply, rock gently. DON'T: Force the stretch or lift lower back.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Back", 
        type: "cooldown" 
    },
    { 
        name: "Legs Up the Wall", 
        description: "Sit close to wall, swing legs up wall and lie back. Let arms rest at sides and breathe deeply. Hold 2-5 minutes. ⚠️ DO: Relax completely, breathe deeply, let legs rest against wall. DON'T: Force legs against wall or hold breath.", 
        equipment: "Bodyweight", 
        level: ["Beginner", "Intermediate", "Advanced"], 
        muscle: "Legs", 
        type: "cooldown" 
    },
    { 
        name: "Corpse Pose", 
        description: "Lie on back with arms at sides, palms up. Close eyes and focus on deep breathing. Let body completely relax. Hold 3-5 minutes. ⚠️ DO: Relax completely, breathe deeply, let go of tension. DON'T: Fall asleep or hold any tension.", 
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
