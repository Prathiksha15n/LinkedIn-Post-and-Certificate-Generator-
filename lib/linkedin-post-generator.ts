// linkedinpostgenerator.tsx
import type { FormData } from "@/app/page"

interface PostTemplate {
  render: (data: FormData) => string
}

const POST_TEMPLATES: PostTemplate[] = [
  {
    render: (data) =>
      `Attending the INDUSTRY READY INDIA webinar hosted by @Incanto Dynamics Private Ltd was a truly transformative experience. The session provided a deep dive into the world of Industrial Automation and Robotics, going beyond theory and introducing practical skills that are vital in today’s manufacturing landscape.

I learned how PLC programming forms the backbone of automation, how SCADA systems help in monitoring complex operations, and how robotics plays a crucial role in improving precision and efficiency on the factory floor. The session also emphasized safety standards and the need for data-driven decision-making in smart factories.

As a ${data.jobRole} at ${data.companyName}, these learnings have given me a clear roadmap to becoming truly industry-ready. I now understand what skills to focus on and how they connect to real-world applications.

A huge thanks to @Srinivas Prabhu, @Balaji Vijaykumar, and the entire team at Incanto Dynamics for delivering such an impactful learning experience.
#IndustrialAutomation #Robotics #IndustryReadyIndia #FutureSkills #SmartManufacturing`,
  },
  {
    render: (data) =>
      `I had the opportunity to attend the INDUSTRY READY INDIA webinar organized by @Incanto Dynamics Private Ltd, and it has been a game-changer in how I view the future of manufacturing. The session covered everything from understanding automation workflows to exploring robotic systems and their integration into modern production lines. Learning about real-time data management, error reduction techniques, and the critical role of process optimization has been invaluable.

As a ${data.jobRole} at ${data.companyName}, this session helped me identify my current skill gaps and align my career path with the needs of the industry. It provided me with clarity on the exact technical skills I need to build, such as robotics control, PLC programming, and industrial communication systems, all of which are essential in the era of smart factories.

My heartfelt gratitude to @Srinivas Prabhu, @Balaji Vijaykumar, and the Incanto Dynamics team for sharing their knowledge and expertise.
#IndustryReadyIndia #SkillDevelopment #Automation #Robotics #FutureOfWork`,
  },
  {
    render: (data) =>
      `The INDUSTRY READY INDIA webinar by @Incanto Dynamics Private Ltd was a powerful session that provided not just theoretical knowledge but real-world, hands-on insights into industrial automation and robotics. During this webinar, I learned how to analyze industrial processes using SCADA systems, design basic automation logic using PLCs, and understand the coordination between robotic arms and production lines. These skills are essential to thrive in today’s competitive manufacturing environment where efficiency, precision, and innovation are key.

As a ${data.jobRole} at ${data.companyName}, this session gave me the confidence to take my learning beyond books and apply it to real industrial systems. It was inspiring to see how these concepts can directly shape the future of industries and create endless opportunities for growth.

Special thanks to @Srinivas Prabhu, @Balaji Vijaykumar, and the entire Incanto Dynamics team for making this session so practical and impactful.
#IndustrialAutomation #IndustryReadyIndia #Robotics #SmartFactories #CareerGrowth`,
  },
  {
    render: (data) =>
      `Attending the INDUSTRY READY INDIA webinar hosted by @Incanto Dynamics Private Ltd was an incredible experience that bridged the gap between theory and real-world industrial practices. The session offered a deep understanding of PLC programming and its critical role in automation. I learned how to design and troubleshoot logic sequences used to control complex machinery, which is a vital skill in modern factories.

As a ${data.jobRole} at ${data.companyName}, I now feel more confident about how automation can increase precision and safety while reducing downtime. Grateful to @Srinivas Prabhu and @Balaji Vijaykumar for making the concepts so relatable and actionable.
#IndustryReadyIndia #IndustrialAutomation #SmartFactories #PLCProgramming #SkillDevelopment`,
  },
  {
    render: (data) =>
      `I had the privilege of attending the INDUSTRY READY INDIA webinar conducted by @Incanto Dynamics Private Ltd, and it was nothing short of a game-changer for me. Over the course of two hours, we explored the real-world applications of industrial automation and robotics, going beyond the textbook concepts I’ve been familiar with.

What stood out to me was how seamlessly automation and robotics are integrated into modern manufacturing to improve efficiency, accuracy, and safety. I learned about PLC programming, SCADA systems, and how robotics can transform repetitive processes into precise, streamlined operations. These aren’t just theoretical ideas—they are practical skills that industries actively seek.

As a ${data.jobRole} at ${data.companyName}, this session gave me a clearer vision of where to focus my energy and how to align my learning with actual industry needs. My sincere thanks to @Srinivas Prabhu, @Balaji Vijaykumar, and the entire Incanto Dynamics team for creating such a valuable and inspiring learning experience.
#IndustryReadyIndia #IndustrialAutomation #Robotics #FutureSkills #CareerGrowth #SkillDevelopment`,
  },
  {
    render: (data) =>
      `Attending the INDUSTRY READY INDIA webinar by @Incanto Dynamics Private Ltd was one of the most eye-opening experiences of my learning journey. The session went beyond basic concepts and gave me a real-world understanding of how automation and robotics work in modern industries.

I learned about the fundamentals of PLC programming, how SCADA systems are used to monitor processes, and how robotics plays a vital role in optimizing production efficiency. What made the session stand out was how practical and detailed it was — it wasn’t just theory, but actual scenarios that industries face every day.

As a ${data.jobRole} at ${data.companyName}, this experience has given me a clear direction on the skills I need to focus on to be truly industry-ready. My sincere gratitude to @Srinivas Prabhu, @Balaji Vijaykumar, and the Incanto Dynamics team for their guidance and support.
#IndustryReadyIndia #IndustrialAutomation #SkillDevelopment #Robotics #CareerGrowth`,
  },
  {
    render: (data) =>
      `The INDUSTRY READY INDIA webinar organized by @Incanto Dynamics Private Ltd helped me connect the dots between what I’ve studied and what industries actually need. During the session, I gained insights into PLC logic design, robotics integration, and real-time data monitoring with SCADA systems. It was fascinating to see how these technologies come together to form the backbone of a smart factory. The trainers not only explained the concepts but also shared their real-world experiences, which made the learning process engaging and relatable.

As a ${data.jobRole} at ${data.companyName}, this session was an important step in my journey toward becoming truly industry-ready. A huge thanks to @Srinivas Prabhu, @Balaji Vijaykumar, and the entire Incanto Dynamics team for creating such a valuable and practical experience.
#IndustryReadyIndia #SmartFactories #Robotics #Automation #FutureSkills`,
  },
  {
    render: (data) =>
      `The INDUSTRY READY INDIA webinar by @Incanto Dynamics Private Ltd was an experience that truly reshaped my perspective on industrial automation. In just a few hours, I gained clarity on how PLC systems are structured and how they control complex machinery with precision. Understanding the role of SCADA systems gave me a clear picture of how industries monitor and manage their operations in real-time. I also saw how robotics is revolutionizing repetitive tasks, creating safer and more efficient production lines.

As a ${data.jobRole} at ${data.companyName}, this session has boosted my confidence and shown me exactly where I need to focus my efforts to be prepared for a career in automation and robotics. A special thank you to @Srinivas Prabhu, @Balaji Vijaykumar, and the entire Incanto Dynamics team for sharing their expertise and making this session so practical and engaging.
#IndustryReadyIndia #Automation #IndustrialSkills #Robotics #CareerGrowth`,
  },
  {
    render: (data) =>
      `The INDUSTRY READY INDIA webinar was a remarkable opportunity to bridge my academic knowledge with real-world industrial practices. Thanks to @Incanto Dynamics Private Ltd, I now have a clearer understanding of how automation systems, robotics, and data-driven decision-making come together to create efficient and sustainable manufacturing environments. Seeing how PLCs and SCADA systems are used to monitor, control, and optimize operations was particularly eye-opening.

As a ${data.jobRole} at ${data.companyName}, I can now see how my learning connects directly to industry needs, giving me a roadmap to enhance my technical skills and career readiness. My heartfelt gratitude to @Srinivas Prabhu and @Balaji Vijaykumar for making this learning experience so insightful and practical.
#IndustryReadyIndia #IndustrialAutomation #FutureSkills #SmartManufacturing`,
  },
  {
    render: (data) =>
      `Attending the INDUSTRY READY INDIA webinar hosted by @Incanto Dynamics Private Ltd was a significant milestone in my learning journey. The session gave me a hands-on understanding of how industries implement automation systems, from PLC programming to robotics and SCADA-based monitoring. It was incredible to see how these technologies work together to improve efficiency, reduce errors, and streamline production.

As a ${data.jobRole} at ${data.companyName}, I now feel more prepared to take the next step in building a career in this exciting field. This webinar has provided me with the clarity and motivation to focus on skills that will make a real impact. Thank you to @Srinivas Prabhu, @Balaji Vijaykumar, and the entire team at Incanto Dynamics for such a valuable experience.
#IndustryReadyIndia #SmartFactories #IndustrialAutomation #SkillDevelopment #FutureOfWork`,
  },
]

export function generateLinkedInPost(data: FormData): string {
  const template = POST_TEMPLATES[Math.floor(Math.random() * POST_TEMPLATES.length)]
  const post = template.render(data)

  const wordCount = post.split(/\s+/).filter((w) => w.length > 0).length
  if (wordCount > 300) {
    return trimToMaxWords(post, 300)
  }
  return post
}

function trimToMaxWords(text: string, maxWords: number): string {
  const words = text.split(/\s+/).filter(Boolean)
  if (words.length <= maxWords) return text
  return words.slice(0, maxWords).join(" ") + "…"
}

export function validateLinkedInPost(post: string): {
  isValid: boolean
  wordCount: number
  errors: string[]
} {
  const errors: string[] = []
  const wordCount = post.split(/\s+/).filter((word) => word.length > 0).length

  if (wordCount > 300) {
    errors.push(`Post exceeds 300 words (${wordCount} words)`)
  }
  // Emojis not allowed
  const emojiRegex =
    /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu
  if (emojiRegex.test(post)) {
    errors.push("Post contains emojis (not allowed)")
  }
  // Allow up to 10 hashtags to accommodate domain tags
  const hashtagCount = (post.match(/#\w+/g) || []).length
  if (hashtagCount > 10) {
    errors.push("Too many hashtags (maximum 10 allowed)")
  }
  if (wordCount < 50) {
    errors.push("Post too short (minimum 50 words)")
  }

  return {
    isValid: errors.length === 0,
    wordCount,
    errors,
  }
}

export function getPostSuggestions(_data: FormData): string[] {
  return [
    "Add one concrete example from the session to increase authenticity.",
    "Mention how you will apply a specific PLC/SCADA/robotics concept in your next task.",
    "Reference a mentor insight from @Srinivas Prabhu or @Balaji Vijaykumar.",
    "Tie the skills to a measurable outcome you’re targeting.",
    "Close with a forward-looking sentence about next steps.",
  ]
}
