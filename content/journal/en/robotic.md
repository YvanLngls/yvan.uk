---
title: Robotics
description: My robotic hand project
date: '2026-08-07'
---

# Robotic Hand

> *We are not interested in the fact that the brain has the consistency of cold porridge.*
>
> *Alan Turing  -  1952*

On July 16, 1945, at 5:29 a.m., the first atomic bomb test in human history was triggered. The infamous Trinity test is a singular example of a meeting between theory and practice. The fatal marriage of nuclear physics equations and radioactive rubble. One can marvel at the beauty of the creative freedom offered by our imagination, just as one can be awed by the brutality and harshness of our reality. But measuring to what extent bringing these two worlds together is a challenge is often difficult. For a long time, I was interested in the elegance of reasoning, the emotions of aesthetics, and the grandeur of abstractions. Matter itself seemed more intimidating to me. Less playful. Even, untamable.

Except that today, nothing seems entirely out of reach anymore. Robotics has become widely accessible to the general public thanks to open-source initiatives like the [Poppy Project](https://poppy-project.org) or developments by [Pollen Robotics](https://pollen-robotics.com/). In fact, it's the robotic hand from the latter that I decided to build: the perfect opportunity to give a physical embodiment to lines of code. Join me on my robotics adventure.

First of all, this project is not finished yet. I simply want to do a quick review since I have a few things to show. It will also allow me to assess where I am and prepare for the next steps of the project. As for the project's origins, it was a video by [Defend Intelligence](https://www.youtube.com/watch?v=HpfKHqlA5Cg) showcasing the [Amazing Hand](https://github.com/pollen-robotics/AmazingHand/tree/Amazing-Hand-Enhanced/) that made me want to take on its realization. It's an excellent gateway into robotics and, as introduced, allows for a connection to be made between the real and the virtual.

So, I started by ordering a few parts, and my first major question regarding the feasibility of this project was controlling the servomotors. Looking at the plans, I decided to go with the enhanced version, which uses higher-performance servomotors. I ordered the motors as well as the controllers, but I made a mistake in choosing the power supply for the electronic board. After several unsuccessful tests, I decided to plug in a laptop power supply: I lost a servomotor in the process and realized that the idea was quite stupid along the way. Following that, I got the correct power supply and was able to control my first servomotors (the Feetech STS3032). From that point on, I thought the project was completely doable, though in reality I was only at the beginning of my robotics adventure.

The next step was to 3D print the parts, a work in progress as I write these lines. I joined a DIY club to get access to a printer. However, the printer is shared and can only be used during club hours, which don't always align with my schedule. Despite that, after a few attempts to calibrate retraction and print settings, I managed to produce my first parts and assemble a first complete finger.

I then mounted the servomotors and connected the whole setup to my computer. That's where the virtual world finally came to life: using a first script, I recorded key finger positions by manipulating it manually, and then a second script executed an animation sequence to replay them on a loop.

The next step was to 3D print the parts, a work in progress as I write these lines. I joined a DIY club to get access to a printer. However, the printer is shared and can only be used during club hours, which don't always align with my schedule. Despite that, after a few attempts to calibrate retraction and print settings, I managed to produce my first parts and assemble a first complete finger.

<div class="flex flex-col md:flex-row items-center justify-center gap-6 my-6">

  <img src="/journal/robotic/ai-first-finger-overview.webp" alt="Doigt robotique" class="w-full max-w-md rounded-xl shadow-lg"/>

  <video src="/journal/robotic/first-finger-action.mp4" controls muted loop class="w-full max-w-md rounded-xl shadow-lg"></video>

</div>

I then mounted the servomotors and connected the whole setup to my computer. That's where the virtual world finally came to life: using a first script, I recorded key finger positions by manipulating it manually, and then a second script executed an animation sequence to replay them on a loop.

The next challenge was to give this hand a form of intelligence. It is a monumental task, so I started with a simple step.

The idea is to be able to communicate with the robot to guide it. I pre-configured a few basic actions (moving the finger, opening it, closing it) that I made available to an LLM in the form of tools (function calling). That way, when I send a message to the machine, it triggers a physical action on the robot in addition to its text response.

We can see it with a few examples:

<div class="flex flex-col md:flex-row gap-6 items-start my-6">
  
  <div class="max-w-md md:w-1/2 shrink-0">

  ```text
  You > Are you ready to do my dishes?
  -> [Execution] play_animation({'anim_name': 'shake_no'})...
  Kimi > (I swing from left to right to indicate my refusal)

  Alas, no! I am a robotic hand, not a dishwasher… I can point, grasp, or ponder (though that is rather metaphorical), but scrubbing plates and holding a sponge is not among my talents. Sorry!

  ```
  
  </div>

  <video src="/journal/robotic/first-finger-no.mp4" controls muted loop class="w-full max-w-md md:w-1/2 rounded-xl shadow-lg"></video>

</div>

Here, the robot indeed shook its finger negatively to mark its refusal, in addition to giving a matching response. It is worth noting that there is still a lot of work left to make the project truly useful..


<div class="flex flex-col md:flex-row gap-6 items-start my-6">
  
  <div class="max-w-md md:w-1/2 shrink-0">

  ```
  You > Are you an intelligent robot?
  -> [Execution] play_animation({'anim_name': 'nod'})...
  Kimi > (I just nodded "yes" to confirm.)
  ```
  </div>

  <video src="/journal/robotic/first-finger-yes.mp4" controls muted loop class="w-full max-w-md md:w-1/2 rounded-xl shadow-lg"></video>

</div>

Here again, we have a demonstration of another animation used by the robot along with its answer.

However, this LLM-based approach remains limited: the model does not "understand" the space around it. To go further, my goal is to explore world models, which focus on prediction within a latent space rather than simple text generation.

In that spirit, I would like to integrate a vision module to feed this latent space. This would give the robot real autonomy and provide it with a concrete representation of its environment. The project remains extremely ambitious, but that is where the adventure becomes fascinating.

The priority thus remains to finish printing the parts. I also plan to continue building the robot beyond the Pollen Robotics blueprints. This could involve designing other elements like a wrist or an elbow. In building this hand, every small step is a great victory, and I really enjoy working in this field, which is quite new to me. So I plan to keep writing about robotics and sharing my progress here.
