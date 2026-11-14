// StarCraft TMG — Rules reference data (restructured from uploads/rules.html)
window.SCTMG_RULES = {
  sections: [
    {
      id: 'overview', num: '01', name: 'Overview', meta: 'The shortest possible overview', color: '#8b7cf6', icon: 'overview',
      intro: 'This is a four-phase alternating-activation wargame. Units usually begin off-table in Reserves, deploy gradually as Supply allows, and try to control Mission Markers to score Victory Points.',
      groups: [
        { name: 'The Four Phases', items: [
            { ph: 'Movement', t: '**Movement:** Deploy, Move, Disengage, or Hold.' },
            { ph: 'Assault', t: '**Assault:** Ranged Attack, Charge, Run, or Hold.' },
            { ph: 'Combat', t: '**Combat:** Every engaged ground unit that is still engaged must fight.' },
            { ph: 'Scoring', t: '**Scoring:** Determine marker control, score VP, resolve end-of-round effects, refresh cards, and set next round initiative.' }
          ]}
      ]
    },
    {
      id: 'concepts', num: '02', name: 'Core Concepts', meta: 'Supply, engagement, coherency, cards', color: '#38d3e8', icon: 'concepts',
      groups: [
        { name: 'Supply', items: [
            { t: 'Current Supply updates as casualties reduce model count.' },
            { t: '**Available Supply** = current Supply Pool minus the Supply already on the battlefield.' },
            { t: 'A unit can only deploy from Reserves if its Current Supply fits inside Available Supply.' },
            { t: 'Some missions also score based on enemy Supply destroyed.' }
          ]},
        { name: 'Engagement', items: [
            { t: 'Engaged units can **Disengage** or **Hold** in Movement.' },
            { t: 'Engaged units can only target units they are already engaged with in Assault.' },
            { t: 'Engaged ground units that are still engaged in Combat **must activate and fight**.' },
            { t: 'Flying units **never** participate in Combat Phase.' }
          ]},
        { name: 'Leading Model & Coherency', items: [
            { t: 'Most movement is **leader-first**. Move the Leading Model first, then set the rest in legal Coherency.' },
            { t: 'Every model must end wholly within **3 inches** of the Leading Model and maintain a legal Coherency Link.' },
            { t: 'The rest of the unit is **set** after the leader moves; you do not individually walk every model.' },
            { t: 'Casualties do not by themselves trigger a new coherency check later.' }
          ]},
        { name: 'Ready & Exhausted Cards', items: [
            { t: '**Ready** = face-up. The card can provide resources or use its own ability.' },
            { t: '**Exhausted** = face-down. It provides no resources and cannot use abilities until Cleanup & Refresh.' },
            { t: 'Resources are generated and spent at the moment you exhaust a card. Unused extra output is lost.' }
          ]}
      ]
    },
    {
      id: 'round', num: '03', name: 'Round Structure', meta: 'Initiative and flow', color: '#f2c14e', icon: 'round',
      groups: [
        { name: 'Before Round 1', items: [
            { t: 'Choose the mission, terrain, deployment map, and starting First Player Marker.' },
            { t: 'Your army is bought during roster building, but most units usually begin off-table in Reserves.' },
            { t: 'You do **not** usually deploy your full army before play starts. Deployment is folded into Movement Phase as Supply escalates.' }
          ]},
        { name: 'Start of Each Round', items: [
            { t: 'Resolve Start of the Round effects and any Tactical Card timing.' },
            { t: 'Check the mission Supply Pool for the current round. Many missions increase it each round.' },
            { t: 'Recalculate Available Supply before deploying new units.' }
          ]},
        { name: 'Two Common Misunderstandings', items: [
            { t: 'You do **not** deploy your whole army at game start. Most units enter gradually during Movement as Supply allows.' },
            { t: '**Charging happens in Assault**, but close-combat attacks are resolved later in Combat Phase.' }
          ]}
      ]
    },
    {
      id: 'phase-movement', num: '04', name: 'Movement Phase', meta: 'Deploy, Move, Disengage, Hold', color: '#4f8df9', icon: 'p1', phase: 'Movement',
      intro: 'Movement is for bringing units onto the table, repositioning unengaged units, escaping melee, and managing tempo through passing.',
      practical: 'You are not just moving models. You are deciding which pieces enter play, which lanes they threaten, and whether you want one more activation or first move in the shooting phase.',
      groups: [
        { name: 'Deploy', items: [
            { t: 'Choose a unit in Reserves that has not activated this phase.' },
            { t: 'Its Current Supply must fit inside Available Supply.' },
            { t: 'Place the Leading Model in contact with your Entry Edge, then move it up to Speed using standard movement rules.' },
            { t: 'Set the rest of the unit in legal Coherency.' },
            { t: 'The unit **cannot** finish deployment inside the enemy Zone of Influence.' }
          ]},
        { name: 'Move', items: [
            { t: 'Choose an **unengaged** on-table unit.' },
            { t: 'Move the Leading Model up to Speed, then set the rest in Coherency.' },
            { t: 'A normal Move cannot end within **1 inch** of an enemy ground unit.' },
            { t: 'A Move or Run must actually change the unit\'s position. If it does not move, it counts as a **Hold** (FAQ v1.3).' },
            { t: 'All standard pathing, terrain, elevation, and gap-clearance rules still apply.' }
          ]},
        { name: 'Disengage', items: [
            { t: 'Choose an engaged unit and move it using standard Move rules.' },
            { t: 'Every surviving model must end **outside** the Engagement Range of all enemy units it was engaged with.' },
            { t: 'Any model that cannot get clear is **removed**.' },
            { t: 'If the Leading Model cannot get clear, the unit does not move, the leader is removed, and the activation ends.' },
            { t: 'A unit that disengages normally **cannot** make a Ranged Attack or Charge in the following Assault Phase.' },
            { t: 'That penalty is ignored if, when disengaging, its Current Supply exceeds the combined Supply of all engaged enemies (**Tactical Mass**).' }
          ]},
        { name: 'Hold', items: [
            { t: 'Hold does nothing, but the unit still counts as activated.' },
            { t: 'This matters when you want Assault initiative more than one more weak movement activation.' }
          ]}
      ]
    },
    {
      id: 'phase-assault', num: '05', name: 'Assault Phase', meta: 'Ranged Attack, Charge, Run, Hold', color: '#f9822f', icon: 'p2', phase: 'Assault',
      intro: 'Assault is where on-table units either shoot, charge, run, or hold. Engagement status quietly invalidates many otherwise legal-looking targets.',
      practical: 'Assault is where damage, target legality, and setup for melee all collide. Many turns hinge on whether you take one more attack now or preserve first activation in Combat.',
      groups: [
        { name: 'Ranged Attack', items: [
            { t: "A legal target must be **visible**, within **range**, and match the weapon's **target tag**." },
            { t: 'An **unengaged** attacker cannot normally target an **engaged** enemy unit.' },
            { t: 'An **engaged** attacker may only target the enemy unit(s) it is already engaged with.' },
            { t: 'Each **batch** is all models using the same weapon profile at the same target.' },
            { t: 'Resolve one batch **completely** before declaring the next batch.' },
            { t: 'If a unit has multiple weapon profiles, separate batches can target different enemy units.' },
            { t: 'Casualties are limited by **visibility, not range**: any target model visible to an attacker can be removed, even if it is outside weapon range (FAQ v1.3).' },
            { t: 'Evade (when allowed) is rolled against the whole Damage Pool, **including Surge** dice. Surge skips Armour, not Evade (FAQ v1.3).' }
          ]},
        { name: 'Attack Sequence', ordered: true, items: [
            { t: 'Build the Attack Pool.' },
            { t: 'Roll to Hit.' },
            { t: "Resolve Surge if the target's tags match the weapon's Surge Type." },
            { t: 'Roll Armour.' },
            { t: 'Roll Evade **only if** the defender is entitled to it.' },
            { t: 'Apply Damage and remove casualties.' }
          ]},
        { name: 'Charge', items: [
            { t: 'Charge is for an **unengaged ground** unit only.' },
            { t: 'Declare **all target units** before rolling.' },
            { t: 'Line of sight is **not** required.' },
            { t: 'Roll **1D6 + Speed** for charge distance.' },
            { t: 'The Leading Model must legally end within 1 inch of **every** declared target, must not overlap bases or impassable terrain, and must not end within 1 inch of an undeclared enemy.' },
            { t: 'If **any** declared target cannot be reached legally, the charge **fails completely** and the unit does not move.' }
          ]},
        { name: 'Run & Hold', items: [
            { t: '**Run** is identical to a standard Move action during Assault.' },
            { t: '**Hold** does nothing but still activates the unit.' },
            { t: 'A unit that disengaged in Movement usually cannot shoot or charge, so Run or Hold are often its only Assault choices.' }
          ]}
      ]
    },
    {
      id: 'phase-combat', num: '06', name: 'Combat Phase', meta: 'Melee resolution', color: '#f04a4a', icon: 'p3', phase: 'Combat',
      intro: 'Combat resolves all melee. It is **mandatory** for any engaged ground unit that is still engaged when its turn to activate comes.',
      practical: 'Assault is where you move into melee; Combat is where that melee actually pays off or collapses.',
      groups: [
        { name: 'Close Ranks', items: [
            { t: 'Before rolling, choose a Leading Model and move it up to **3 inches** using standard Move rules with extra restrictions.' },
            { t: 'The Leading Model must end **closer** to the enemy unit(s) it is engaged with.' },
            { t: 'The move **cannot** bring the unit into engagement with new enemy units.' },
            { t: 'The move **cannot** be used to disengage from enemy units.' },
            { t: 'Models already in base-to-base contact do not move.' },
            { t: 'Close Ranks is mainly for pulling more models into Fighting Rank and Supporting Rank.' }
          ]},
        { name: 'Who Can Attack in Melee', items: [
            { t: '**Fighting Rank:** models within 1 inch of an enemy model.' },
            { t: '**Supporting Rank:** models in base-to-base contact with a friendly model from the same unit that is in Fighting Rank.' },
            { t: 'Line of sight is **not** required for melee attacks.' },
            { t: 'Use only **Combat Phase weapons**.' },
            { t: 'If a model has more than one eligible melee weapon, the controlling player chooses one.' }
          ]},
        { name: 'Multiple Enemy Units', items: [
            { t: 'If a unit is engaged with more than one enemy unit, each model attacks an enemy unit it is in Fighting or Supporting Rank with; decide this **before rolling**.' },
            { t: 'Declare which target receives the Surge Die **before rolling**.' },
            { t: 'That declaration is **binding**.' }
          ]},
        { name: 'Combat Reminders', items: [
            { t: 'Melee uses the same six-step attack sequence as ranged attacks.' },
            { t: '**Evade in melee is NOT automatic.** A unit only gets it if a rule explicitly grants it.' },
            { t: 'Use the engaged casualty priority rules.' },
            { t: "After casualties are removed, if none of the unit's models remain within 1 inch of an enemy, the unit becomes unengaged immediately." },
            { t: 'A unit freed from combat before it activates no longer has to fight that phase.' }
          ]}
      ]
    },
    {
      id: 'phase-scoring', num: '07', name: 'Scoring & Cleanup', meta: 'VP, markers, refresh', color: '#35c76b', icon: 'p4', phase: 'Scoring',
      intro: 'This phase decides who is actually winning. **Follow the order strictly.**',
      practical: 'This is where board position becomes score, and where the round-end timing window matters. Do not skip straight from fighting to refreshing cards.',
      groups: [
        { name: 'Mission Marker Control', items: [
            { t: 'A unit contests only if it is on the battlefield, in coherency, and has at least one model within **3 inches** of the marker with **line of sight** to it and on the **same elevation**.' },
            { t: '**Flying** units cannot contest or control.' },
            { t: '**Burrowed** units cannot contest or control.' },
            { t: 'Control is determined by eligible **Current Supply**, not model count.' },
            { t: 'A tie does **not** transfer control.' },
            { t: 'Deactivated Mission Markers can still be controlled (FAQ v1.3).' },
            { t: 'Control is **sticky**: once a player controls a marker, it stays theirs until the enemy wins a later comparison with higher Supply.' }
          ]},
        { name: 'End of Game & Refresh', items: [
            { t: 'The game can end by mission special win condition, tabling, or round limit.' },
            { t: 'If a player has no models on the battlefield and no units in Reserves, the surviving player gains **+10 VP**.' },
            { t: 'At the start of the final Scoring Phase, units still in Reserves are treated as destroyed for scoring.' },
            { t: 'End-of-round effects resolve **before** Cleanup & Refresh.' },
            { t: 'Cleanup removes temporary tokens (keeping **STAY IN PLAY** tokens, Damage Markers, Mission Markers and the Faction Indicators that show control).' },
            { t: 'Exhausted Tactical Cards and Faction Cards refresh here — **not earlier**.' },
            { t: 'Then the player with **fewer VP** takes the First Player Marker for the next round; if tied, roll off.' }
          ]}
      ]
    },
    {
      id: 'situations', num: '08', name: 'Situation Guide', meta: 'What can I do right now?', color: '#ec5f99', icon: 'situations',
      groups: [
        { name: 'My unit is in Reserves', items: [
            { t: 'It normally cannot use Active, Passive, or Reaction abilities unless a rule explicitly says it can.' },
            { t: 'Its normal action is to **Deploy** during Movement if its Supply fits.' },
            { t: 'It does not act in Assault or Combat while in Reserves.' }
          ]},
        { name: 'My unit is unengaged on the battlefield', items: [
            { ph: 'Movement', t: 'Move or Hold.' },
            { ph: 'Assault', t: 'Ranged Attack, Charge, Run, or Hold.' },
            { ph: 'Combat', t: 'Nothing unless it becomes engaged.' },
            { ph: 'Scoring', t: 'Contest a marker if it meets all conditions.' }
          ]},
        { name: 'My unit is engaged', items: [
            { ph: 'Movement', t: 'Disengage or Hold.' },
            { ph: 'Assault', t: 'It can activate, but targeting is heavily restricted.' },
            { ph: 'Combat', t: 'If it is a ground unit and still engaged, it **must fight**.' }
          ]},
        { name: 'My unit just disengaged', items: [
            { t: 'It normally **cannot** make a Ranged Attack or Charge in the following Assault Phase.' },
            { t: 'If **Tactical Mass** applied at disengage, that penalty is ignored.' },
            { t: 'Its realistic Assault options are often Run or Hold.' }
          ]},
        { name: 'I want to shoot', items: [
            { t: 'Check **visibility, range, and target tags** first.' },
            { t: 'Then check **engagement legality** — engagement can invalidate an otherwise legal-looking target.' },
            { t: 'Declare and resolve batches one at a time.' }
          ]},
        { name: 'I want to charge', items: [
            { t: 'The unit must be **unengaged and grounded**.' },
            { t: 'Declare **all targets first**.' },
            { t: 'A multi-charge only succeeds if **all** declared targets can be reached legally.' }
          ]},
        { name: 'I am in melee with multiple enemy units', items: [
            { t: 'Each model attacks an enemy it is ranked against; **decide before rolling**.' },
            { t: 'You **must declare** which target gets the Surge Die before rolling.' },
            { t: 'You **cannot** assign results after seeing the dice.' }
          ]},
        { name: 'I am near a Mission Marker', items: [
            { t: 'Distance alone is **not** enough.' },
            { t: 'You need: battlefield presence, coherency, line of sight, same elevation, and correct unit state.' },
            { t: '**Flying, Burrowed, and out-of-coherency** units do not contest.' }
          ]},
        { name: 'My card is Ready', items: [
            { t: 'It may be exhausted for **resources** or to use its own **ability**, depending on timing and cost.' },
            { t: 'That choice is made when you use the card, not preselected for the round.' }
          ]},
        { name: 'My card is Exhausted', items: [
            { t: 'It provides **no resources** and cannot use abilities until Cleanup & Refresh.' },
            { t: 'You **cannot double-dip** a face-down card for both resources and an ability.' }
          ]}
      ]
    },
    {
      id: 'abilities', num: '09', name: 'Abilities & Resources', meta: 'Active, Passive, Reaction, Payment', color: '#b06ef7', icon: 'abilities',
      groups: [
        { name: 'Active Abilities', items: [
            { t: 'May only be used while the unit is **currently activated**.' },
            { t: 'Must be triggered immediately **before** declaring an action or immediately **after** one fully resolves.' },
            { t: '**Cannot** be used in the middle of an action.' },
            { t: '**Cannot** normally be used while the unit is in Reserves.' },
            { t: 'Each named Active ability is usually once per round per unit unless it is **Repeatable**.' },
            { t: 'A unit may use any number of **differently named** Active abilities or Tactical Cards in one activation, if it can pay for them (FAQ v1.3).' },
            { t: 'A Tactical Card\'s Active ability still needs an activated unit on the battlefield, even if the card affects something else (FAQ v1.3).' }
          ]},
        { name: 'Passive Abilities', items: [
            { t: '**Always on** while the unit is on the battlefield.' },
            { t: 'Do not require activation.' },
            { t: 'Do not normally function while in Reserves unless stated otherwise.' }
          ]},
        { name: 'Reaction Abilities', items: [
            { t: 'Trigger in direct response to a defined event.' },
            { t: 'Must be declared at the **exact trigger moment**.' },
            { t: '**Cannot** be used retroactively.' },
            { t: 'Each player may resolve only **one Reaction per Activation**. REPEATABLE does not change this.' },
            { t: 'Reactions can also trigger **outside an activation**; then each player gets only one Reaction per phase, and the First Player Marker holder resolves first (FAQ v1.3).' },
            { t: 'If both players react to the same trigger, the Active Player resolves first.' }
          ]},
        { name: 'Resource Payment Rules', items: [
            { t: 'Terran uses **CP**, Zerg uses **BM**, and Protoss uses **PE**.' },
            { t: 'To pay a cost, exhaust a Ready Faction Card or Tactical Card that produces the required resource type.' },
            { t: 'If you cannot exhaust enough cards to pay the full cost, the ability **cannot be activated**.' },
            { t: 'Excess output is **lost**.' },
            { t: 'Resources generated for one ability **cannot be saved** for another later ability.' }
          ]}
      ]
    },
    {
      id: 'mistakes', num: '10', name: 'Common Mistakes', meta: 'High-frequency errors & judge reminders', color: '#f04a4a', icon: 'mistakes', kind: 'mistakes',
      groups: [
        { name: 'Judge Reminders', items: [
            { t: 'Walking every model individually instead of moving the Leading Model first and then setting the rest in coherency.' },
            { t: 'Forgetting that Deploy still uses standard movement rules and can be blocked by Available Supply or Zone of Influence.' },
            { t: 'Forgetting that disengage can kill trailing models and that the leader dying can cause the whole move to fail.' },
            { t: 'Letting a disengaged unit shoot or charge in Assault when Tactical Mass did not remove the penalty.' },
            { t: 'Shooting into melee illegally with an unengaged unit.' },
            { t: 'Letting an engaged attacker target enemies it is not engaged with.' },
            { t: 'Declaring all weapon targets at once instead of one batch at a time.' },
            { t: 'Treating a failed multi-charge as a partial success.' },
            { t: 'Forgetting Close Ranks in Combat.' },
            { t: 'Giving melee attacks an Evade Roll automatically.' },
            { t: 'Deciding which enemy each model attacks after rolling, when engaged with multiple enemy units.' },
            { t: 'Using visibility-based casualty removal when engaged casualty priority is required.' },
            { t: 'Counting model count instead of Current Supply for Mission Marker control.' },
            { t: 'Letting Flying, Burrowed, or Out-of-Coherency units contest markers.' },
            { t: 'Refreshing exhausted cards too early.' }
          ]}
      ]
    }
  ]
};
