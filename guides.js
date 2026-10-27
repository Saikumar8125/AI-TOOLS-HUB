/* ===== AI TOOLS HUB GUIDES: one entry per industry guide =====
   build.js turns each entry into /guides/<s>. Tool names must match data.js exactly.
   s = slug, t = page title, who = audience, i = intro, sec = sections (h heading, p text, tools),
   tip = quick start steps, faq = [question, answer],
   why = { "Tool name": "one line on why this tool fits this audience" } (optional, shown under each tool),
   price = { "Tool name": "INR price, verified on the official page, with date" } (optional) */
window.AITH_GUIDES = [
{
  s: "ca-firms", t: "Best AI Tools for CA Firms in India", who: "CA and accounting firms",
  i: "A small CA practice spends most of its week on data entry, client follow-ups, notices and reports. These AI tools take the repetitive parts off your team, while you keep the final review.",
  sec: [
    { h: "GST billing and books", p: "Start with accounting software built for Indian GST rules, then use AI on top of the data it holds.", tools: ["Zoho Books", "Clear", "TallyPrime", "myBillBook"] },
    { h: "Reading notices, circulars and contracts", p: "Upload a PDF and ask questions in plain language. Always check the answer against the source page before you advise a client.", tools: ["ChatGPT", "Claude", "NotebookLM", "ChatPDF"] },
    { h: "Excel and data work", p: "Write formulas, clean ledgers and build summaries from messy client spreadsheets.", tools: ["GPT for Sheets", "Formula Bot", "Julius AI", "Microsoft 365 Copilot"] },
    { h: "Client meetings and follow-ups", p: "Record calls, get action items, and send reminders for document collection on WhatsApp.", tools: ["Fathom", "Otter.ai", "AiSensy", "Zapier"] }
  ],
  why: {
    "Zoho Books": "GST invoicing and returns-ready data in one cloud ledger. Has a free plan for small businesses.",
    "Clear": "Built for GST return filing and reconciliation, so mismatches show up before the due date.",
    "TallyPrime": "Most clients already use Tally, so you work in the books they keep.",
    "myBillBook": "Phone-first billing for small clients who find Tally too heavy.",
    "ChatGPT": "Explains a notice in plain words and drafts client replies. Verify before sending.",
    "Claude": "Handles long circulars and orders well. Paste the section, ask for a summary, check the source.",
    "NotebookLM": "Answers only from the documents you upload, so each answer points back to the circular.",
    "ChatPDF": "Quick questions on a single PDF without setting up a notebook.",
    "GPT for Sheets": "Categorises and cleans ledger descriptions inside Google Sheets.",
    "Formula Bot": "Describe the calculation in English and get the Excel formula.",
    "Julius AI": "Upload a messy spreadsheet and ask for summaries and charts.",
    "Microsoft 365 Copilot": "Worth it only if your firm already pays for Microsoft 365. Works inside Excel and Word.",
    "Fathom": "Records client calls and lists action items.",
    "Otter.ai": "Transcribes meetings. Check names and figures before relying on the notes.",
    "AiSensy": "Sends monthly document-collection reminders to clients on WhatsApp.",
    "Zapier": "Connects a form or sheet to reminders so follow-ups go out automatically."
  },
  price: {
    "TallyPrime": "From ₹750/month (single-user rental) + 18% GST, per tallysolutions.com on 27 Oct 2026"
  },
  tip: ["Pick one GST billing tool and move all clients onto it", "Use NotebookLM for every new circular: upload, ask, verify", "Automate monthly document-reminder messages with Zapier"],
  faq: [["Can AI file GST returns for my clients?", "No. AI tools help with data entry, reconciliation and drafting, but a qualified person must review and file returns."], ["Is it safe to upload client data to AI tools?", "Remove PAN, Aadhaar and bank details before uploading, and check each tool's data policy. Business plans of ChatGPT and Claude do not train on your data by default."]]
},
{
  s: "restaurants", t: "Best AI Tools for Restaurants and Cafés in India", who: "restaurants, cafés and cloud kitchens",
  i: "Good food photos, fast replies on WhatsApp and regular Instagram posts bring orders. These AI tools help a small restaurant do all three without a marketing team.",
  sec: [
    { h: "Food photos and menu design", p: "Turn phone photos into clean menu shots and design menu cards and offer posters in minutes.", tools: ["Photoroom", "Canva", "Adobe Express"] },
    { h: "Instagram reels and posts", p: "Edit reels with captions, and plan a week of posts in one sitting.", tools: ["CapCut", "Predis.ai", "Buffer AI", "Captions"] },
    { h: "WhatsApp orders and replies", p: "Share your menu, take orders and send offers to past customers on WhatsApp Business.", tools: ["AiSensy", "Interakt", "Wati", "Meta AI"] },
    { h: "Billing and costing", p: "GST billing, plus help working out recipe costs and menu prices.", tools: ["myBillBook", "Swipe", "ChatGPT"] }
  ],
  why: {
    "Photoroom": "Clean backgrounds and brighter light on dish photos for Swiggy, Zomato and Instagram.",
    "Canva": "Menu cards, table tents and offer posters from templates.",
    "Adobe Express": "Canva alternative with quick resizing for Instagram and print.",
    "CapCut": "Auto-captions and templates for reels from phone clips.",
    "Predis.ai": "Generates a week of posts and captions from a short prompt.",
    "Buffer AI": "Schedules posts to Instagram and Facebook and drafts captions.",
    "Captions": "Talking-head reels with captions, handy for owner or chef videos.",
    "AiSensy": "Menu, offers and broadcasts to past customers on WhatsApp Business.",
    "Interakt": "WhatsApp catalog and order chat, with Shopify support if you sell online.",
    "Wati": "Shared inbox so several staff can answer one WhatsApp number.",
    "Meta AI": "Free help with replies and post ideas inside WhatsApp and Instagram.",
    "myBillBook": "GST bills from a phone for dine-in and takeaway.",
    "Swipe": "GST invoicing app that can read invoices from images.",
    "ChatGPT": "Works out recipe cost and menu prices from your ingredient list. Also drafts review replies."
  },
  tip: ["Reshoot your top 10 dishes and clean them up with Photoroom", "Post 3 reels a week with CapCut auto-captions", "Put your menu in a WhatsApp catalog", "Draft replies to your last 10 Swiggy and Zomato reviews with ChatGPT"],
  faq: [["What is the cheapest way to start?", "Canva, CapCut and Meta AI all have free plans, which is enough for menu posters, reels and caption ideas."], ["Can AI reply to Swiggy and Zomato reviews?", "Yes, as drafts. Paste the review into ChatGPT (listed above), ask for a short, polite reply that mentions the dish, then edit it and post it from your Swiggy or Zomato partner app. Answer complaints the same day."]]
},
{
  s: "kirana-shops", t: "Best AI Tools for Kirana and Retail Shops in India", who: "kirana stores and small retail shops",
  i: "A kirana shop runs on credit, WhatsApp orders and tight margins. These simple AI tools help with billing, stock and staying in touch with regular customers, mostly from a phone.",
  sec: [
    { h: "Billing, stock and credit (udhaar)", p: "GST bills from your phone, stock alerts and payment reminders for customers on credit.", tools: ["myBillBook", "Swipe", "TallyPrime"] },
    { h: "WhatsApp orders and offers", p: "Take home-delivery orders and send weekly offers to your regular customers.", tools: ["AiSensy", "Interakt", "Meta AI"] },
    { h: "Posters and shop boards", p: "Make festival offer posters and price boards in Telugu, Hindi or English.", tools: ["Canva", "Microsoft Designer", "Adobe Express"] },
    { h: "Help in your own language", p: "Ask questions, translate supplier messages and write announcements in Indian languages.", tools: ["Gemini", "ChatGPT", "Sarvam AI", "Google Translate"] }
  ],
  why: {
    "myBillBook": "Bills and stock from a phone, with payment reminders for credit customers.",
    "Swipe": "Alternative to myBillBook for GST invoicing.",
    "TallyPrime": "Keep books in Tally if your CA already uses it.",
    "AiSensy": "Weekly offers to regular customers on WhatsApp.",
    "Interakt": "WhatsApp catalog for home-delivery orders.",
    "Meta AI": "Free help writing offer messages inside WhatsApp.",
    "Canva": "Festival offer posters from templates, with Telugu and Hindi text.",
    "Microsoft Designer": "Makes a poster from a text description.",
    "Adobe Express": "Price boards and offer flyers from templates.",
    "Gemini": "Ask questions and translate in Telugu, Hindi and other Indian languages.",
    "ChatGPT": "Writes announcements and supplier messages, and works by voice.",
    "Sarvam AI": "Built for Indian languages.",
    "Google Translate": "Instant translation of supplier messages and bills."
  },
  tip: ["Move billing to myBillBook or Swipe on your phone", "Collect customer numbers and build a WhatsApp broadcast list", "Make one festival poster a week in Canva"],
  faq: [["Do I need a computer?", "No. Every tool in this guide works on an Android phone."], ["Which tools work in Telugu or Hindi?", "Gemini, ChatGPT and Google Translate understand major Indian languages, and Sarvam AI is built for Indian languages."]]
},
{
  s: "clinics", t: "Best AI Tools for Clinics and Doctors in India", who: "clinics, doctors and diagnostic centres",
  i: "Doctors lose hours to notes, appointment calls and patient queries. These AI tools save that time on admin. They are not for diagnosis.",
  sec: [
    { h: "Appointments and patient messages", p: "Send appointment reminders, reports-ready alerts and clinic timings on WhatsApp.", tools: ["AiSensy", "Interakt", "Tidio"] },
    { h: "Notes and documentation", p: "Dictate notes, letters and referral summaries, then check and edit them.", tools: ["Otter.ai", "Whisper", "ChatGPT", "Claude"] },
    { h: "Patient education", p: "Turn medical advice into simple leaflets and short videos in local languages.", tools: ["Canva", "Gemini", "Google Translate", "HeyGen"] },
    { h: "Research and updates", p: "Find and summarise recent papers and guidelines quickly.", tools: ["Consensus", "Elicit", "Perplexity", "NotebookLM"] }
  ],
  why: {
    "AiSensy": "Appointment reminders and report-ready alerts on WhatsApp.",
    "Interakt": "Shared WhatsApp inbox for reception staff.",
    "Tidio": "Website chat for clinic timings and common questions.",
    "Otter.ai": "Transcribes dictated notes. Edit before filing.",
    "Whisper": "Free OpenAI speech-to-text that handles many languages. Needs some technical setup.",
    "ChatGPT": "Turns rough notes into letters and referral summaries to review.",
    "Claude": "Good at turning long notes into clear summaries. Remove patient names first.",
    "Canva": "Leaflets and clinic posters from templates.",
    "Gemini": "Translates patient advice into Telugu, Hindi and other languages.",
    "Google Translate": "Quick translation. Have staff check medical wording.",
    "HeyGen": "Turns a script into a short avatar video for patient education.",
    "Consensus": "Finds answers from published research papers.",
    "Elicit": "Summarises and compares studies on a question.",
    "Perplexity": "Search with sources you can open and check.",
    "NotebookLM": "Upload guidelines and ask questions grounded in them."
  },
  tip: ["Automate appointment reminders on WhatsApp first", "Make one patient leaflet per common condition", "Use Consensus to check what recent studies say"],
  faq: [["Can AI diagnose patients?", "No. Use these tools for admin, communication and reading. Clinical decisions stay with the doctor."], ["Is patient data safe?", "Never upload identifiable patient records to public AI tools. Remove names and IDs first."]]
},
{
  s: "coaching-centres", t: "Best AI Tools for Coaching Centres and Tutors in India", who: "coaching centres, tuition classes and tutors",
  i: "Making question papers, notes and doubt answers takes hours every week. These AI tools help tutors make material faster and give students practice anytime.",
  sec: [
    { h: "Question papers and quizzes", p: "Make MCQs, worksheets and practice tests from your own notes or chapters.", tools: ["Quizgecko", "ChatGPT", "Gemini", "Knowt"] },
    { h: "Notes, slides and explainers", p: "Turn chapters into short notes, slides and explainer videos.", tools: ["NotebookLM", "Gamma", "Napkin AI", "Canva"] },
    { h: "Maths and science help", p: "Step-by-step solutions students can use for revision.", tools: ["Photomath", "Wolfram Alpha", "Symbolab", "Khanmigo"] },
    { h: "Admissions and parent updates", p: "Send batch timings, fee reminders and results to parents on WhatsApp, and promote admissions on Instagram.", tools: ["AiSensy", "Interakt", "CapCut", "Predis.ai"] }
  ],
  why: {
    "Quizgecko": "Makes MCQs from pasted text or a PDF chapter.",
    "ChatGPT": "Drafts question papers and answer keys. Check every answer.",
    "Gemini": "Free option for worksheets and explanations.",
    "Knowt": "Turns notes into flashcards and practice tests for students.",
    "NotebookLM": "Upload a chapter and get summaries, quizzes and an audio overview.",
    "Gamma": "Turns a chapter outline into slides in minutes.",
    "Napkin AI": "Turns text into simple diagrams for notes.",
    "Canva": "Test-series posters and result cards.",
    "Photomath": "Step-by-step solutions from a photo of a problem.",
    "Wolfram Alpha": "Exact computation for maths and science problems.",
    "Symbolab": "Step-by-step algebra and calculus.",
    "Khanmigo": "Khan Academy's AI tutor, built to guide students rather than hand over answers.",
    "AiSensy": "Batch timings, fee reminders and results to parents on WhatsApp.",
    "Interakt": "Parent chats with a shared inbox for staff.",
    "CapCut": "Short doubt-solving reels.",
    "Predis.ai": "Admission posters and captions in bulk."
  },
  tip: ["Upload each chapter to NotebookLM and generate a quiz", "Send weekly test results to parents on WhatsApp", "Post one short doubt-solving reel a week"],
  faq: [["Will students just copy answers?", "Use AI to make practice and explanations, and keep tests offline or timed."], ["Which tools are free?", "NotebookLM, Knowt and Google Read Along are free, and ChatGPT, Gemini and Gamma have free plans."]]
},
{
  s: "real-estate", t: "Best AI Tools for Real Estate Agents in India", who: "real estate agents and builders",
  i: "Listings, site visit follow-ups and daily posts decide who closes the deal. These AI tools help agents create listings faster and reply to every lead.",
  sec: [
    { h: "Property photos and videos", p: "Brighten photos, remove clutter and make walk-through reels.", tools: ["Photoroom", "Let's Enhance", "CapCut", "InVideo"] },
    { h: "Listings and ad copy", p: "Write listing descriptions, ad copy and brochures in English and local languages.", tools: ["ChatGPT", "Gemini", "Canva", "AdCreative.ai"] },
    { h: "Lead follow-up", p: "Reply to enquiries quickly and send site-visit reminders on WhatsApp.", tools: ["AiSensy", "Wati", "Gallabox", "Zapier"] },
    { h: "Avatar and explainer videos", p: "Make project explainer videos without shooting every time.", tools: ["HeyGen", "Synthesia", "Fliki"] }
  ],
  why: {
    "Photoroom": "Cleans up photos for brochures and posts.",
    "Let's Enhance": "Upscales low-resolution site photos.",
    "CapCut": "Walk-through reels from phone clips.",
    "InVideo": "Turns a script into a project video.",
    "ChatGPT": "Listing descriptions and ad copy in English, Telugu or Hindi.",
    "Gemini": "Free option for listing copy and translation.",
    "Canva": "Brochures and Instagram post templates.",
    "AdCreative.ai": "Generates ad creatives for Facebook and Google campaigns.",
    "AiSensy": "Auto-replies to enquiries and sends site-visit reminders.",
    "Wati": "Shared WhatsApp inbox for your sales team.",
    "Gallabox": "WhatsApp inbox with chatbot flows to capture leads.",
    "Zapier": "Sends new website or ad leads straight to WhatsApp or a sheet.",
    "HeyGen": "Presenter-style project videos without a shoot.",
    "Synthesia": "Avatar videos from a script, in many languages.",
    "Fliki": "Text to video with voiceover in many languages."
  },
  tip: ["Make one template for listing posts in Canva", "Connect your lead forms to WhatsApp with Zapier", "Post a 30-second walk-through reel for each project"],
  faq: [["Can I use AI images of properties?", "Edit real photos, but do not show features that do not exist. That misleads buyers and breaks RERA ad rules."], ["Which tool is best for leads?", "A WhatsApp Business API tool like AiSensy, Wati or Gallabox, so no enquiry goes unanswered."]]
},
{
  s: "boutiques", t: "Best AI Tools for Boutiques and Fashion Sellers in India", who: "boutiques, saree shops and fashion sellers",
  i: "Fashion sells on photos and Instagram. These AI tools give a small boutique studio-quality product photos and regular posts without a photographer.",
  sec: [
    { h: "Product photos and models", p: "Clean backgrounds, studio shots and lifestyle scenes from simple phone photos.", tools: ["Photoroom", "Pebblely", "Claid", "Picsart AI"] },
    { h: "Instagram and reels", p: "Short try-on reels, captions and a posting plan.", tools: ["CapCut", "Captions", "Predis.ai", "Metricool"] },
    { h: "WhatsApp catalog and orders", p: "Share new arrivals, take orders and collect payments on WhatsApp.", tools: ["AiSensy", "Interakt", "Wati"] },
    { h: "Online store", p: "Start a simple website or store when you are ready to grow beyond Instagram.", tools: ["Durable", "Wix ADI", "Shiprocket"] }
  ],
  why: {
    "Photoroom": "Clean backgrounds for saree and dress photos.",
    "Pebblely": "Places products in styled scenes. Works best for accessories and jewellery.",
    "Claid": "Enhances and standardises product photos in bulk.",
    "Picsart AI": "Edit and restyle photos on your phone.",
    "CapCut": "Try-on reels with templates and captions.",
    "Captions": "Auto-captions for talking reels.",
    "Predis.ai": "A weekly post plan with captions.",
    "Metricool": "Schedules posts and shows which ones work.",
    "AiSensy": "New-arrival broadcasts to your customer list.",
    "Interakt": "WhatsApp catalog with orders and Shopify sync.",
    "Wati": "Team inbox for busy festival-season messages.",
    "Durable": "Builds a simple website in minutes.",
    "Wix ADI": "Wix's AI website builder.",
    "Shiprocket": "Compares couriers and handles COD shipping across India."
  },
  tip: ["Shoot every new piece on the same plain background", "Batch-edit photos in Photoroom", "Send new arrivals to your WhatsApp list every Friday"],
  faq: [["Do AI model photos look real?", "Good tools look close, but always show the real fabric and colour so returns stay low."], ["Where do I start with a small budget?", "Canva and CapCut have free plans, and Photoroom offers a free trial on its paid plans."]]
},
{
  s: "salons", t: "Best AI Tools for Salons and Beauty Parlours in India", who: "salons, beauty parlours and spas",
  i: "Bookings, before-and-after posts and repeat customers make a salon grow. These AI tools help with all three.",
  sec: [
    { h: "Bookings and reminders", p: "Send appointment reminders and festive offers to regular clients on WhatsApp.", tools: ["AiSensy", "Interakt", "Tidio"] },
    { h: "Before-and-after reels", p: "Edit transformation reels with captions and trending formats.", tools: ["CapCut", "Captions", "Remini"] },
    { h: "Offers and price lists", p: "Design rate cards, offer posters and Google profile posts.", tools: ["Canva", "Microsoft Designer", "ChatGPT"] },
    { h: "Billing", p: "GST bills and service records.", tools: ["myBillBook", "Swipe"] }
  ],
  why: {
    "AiSensy": "Appointment reminders and festive offers on WhatsApp.",
    "Interakt": "Shared inbox and service catalog on WhatsApp.",
    "Tidio": "Website chat widget for booking questions.",
    "CapCut": "Transformation reels with captions and templates.",
    "Captions": "Auto-captions for talking reels.",
    "Remini": "Sharpens before-and-after photos.",
    "Canva": "Rate cards and offer posters from templates.",
    "Microsoft Designer": "Makes a poster from a text description.",
    "ChatGPT": "Writes offer text and Google Business profile posts.",
    "myBillBook": "GST bills and service records from a phone.",
    "Swipe": "Alternative for GST invoicing."
  },
  tip: ["Ask happy clients for a before-and-after reel", "Send a reminder 4 weeks after each haircut", "Keep your Google Business profile updated weekly"],
  faq: [["Which tool is best for Instagram?", "CapCut for reels and Canva for posts. Both have free plans."], ["Can AI handle bookings?", "Use WhatsApp automation to confirm and remind. Keep a person to handle changes."]]
},
{
  s: "schools", t: "Best AI Tools for Schools and Teachers in India", who: "schools and teachers",
  i: "Teachers spend evenings on lesson plans, worksheets and report comments. These AI tools give that time back. Schools should set clear rules for student use.",
  sec: [
    { h: "Lesson plans and worksheets", p: "Draft lesson plans, worksheets and rubrics, then adapt them to your class.", tools: ["ChatGPT", "Gemini", "Quizgecko", "Coursebox"] },
    { h: "Slides and visuals", p: "Turn a topic into slides and simple diagrams.", tools: ["Gamma", "Canva", "Napkin AI"] },
    { h: "Reading and language", p: "Reading practice for young children and spoken English practice for older students.", tools: ["Google Read Along", "Duolingo Max", "Elsa Speak"] },
    { h: "Parent communication", p: "Circulars, translations and WhatsApp updates for parents.", tools: ["Google Translate", "Sarvam Translate", "AiSensy"] }
  ],
  why: {
    "ChatGPT": "Lesson plans, worksheets and rubrics. Edit to your syllabus.",
    "Gemini": "Free option for drafts and explanations.",
    "Quizgecko": "MCQs from chapter text.",
    "Coursebox": "Builds a course outline with quizzes.",
    "Gamma": "Turns a topic into slides quickly.",
    "Canva": "Worksheets, charts and classroom posters.",
    "Napkin AI": "Turns text into simple diagrams.",
    "Google Read Along": "Free reading practice for young children.",
    "Duolingo Max": "Paid tier with AI conversation practice for spoken English.",
    "Elsa Speak": "Pronunciation feedback for English.",
    "Google Translate": "Translates circulars for parents.",
    "Sarvam Translate": "Translation built for Indian languages.",
    "AiSensy": "Sends circulars and updates to parents on WhatsApp."
  },
  tip: ["Write a one-page AI policy for students and staff", "Use Gemini or ChatGPT for first drafts of lesson plans", "Try Google Read Along in primary classes"],
  faq: [["Should students use ChatGPT?", "Yes, with rules: use it to explain and practise, not to write submitted work."], ["Which tools are free for schools?", "Google Read Along, NotebookLM and Google Translate are free. Gemini, Canva and Gamma have free plans."]]
},
{
  s: "lawyers", t: "Best AI Tools for Lawyers and Law Firms in India", who: "advocates and small law firms",
  i: "Drafting, reading long documents and client updates fill a lawyer's day. AI helps with first drafts and summaries. Every citation must be checked by you.",
  sec: [
    { h: "Reading and summarising documents", p: "Upload agreements, judgments and case files and ask questions about them.", tools: ["Claude", "NotebookLM", "Humata"] },
    { h: "Drafting", p: "First drafts of notices, agreements and emails to edit.", tools: ["ChatGPT", "Spellbook", "Grammarly"] },
    { h: "Dictation and meetings", p: "Dictate drafts and record client meetings.", tools: ["Otter.ai", "Whisper", "Fathom"] },
    { h: "Client updates", p: "Hearing date reminders and updates on WhatsApp.", tools: ["AiSensy", "Interakt"] }
  ],
  why: {
    "Claude": "Strong on long documents and first drafts. Check every point against the source.",
    "NotebookLM": "Answers grounded in the case files you upload.",
    "ChatGPT": "First drafts and plain-language explanations. It can invent citations, so verify.",
    "Humata": "Ask questions on a PDF and see where in the document the answer came from.",
    "Spellbook": "Contract drafting assistant that works inside Word.",
    "Grammarly": "Proofreads drafts for errors and tone.",
    "Otter.ai": "Transcribes dictation and client meetings.",
    "Whisper": "Free OpenAI speech-to-text. Needs some technical setup.",
    "Fathom": "Records client calls and lists action items.",
    "AiSensy": "Hearing-date reminders to clients on WhatsApp.",
    "Interakt": "Shared WhatsApp inbox for client updates."
  },
  tip: ["Use NotebookLM for each case file", "Keep a library of your own templates and let AI fill them", "Verify every case citation in an official database"],
  faq: [["Can I trust AI case citations?", "No. AI tools can invent citations. Check every one in SCC Online, Manupatra or the court website."], ["Is client data safe?", "Remove names and identifying details, and use business plans that do not train on your data."]]
},
{
  s: "freelancers", t: "Best AI Tools for Freelancers in India", who: "freelancers and solo consultants",
  i: "A freelancer is the salesperson, worker and accountant at once. These AI tools save hours on proposals, delivery and invoices.",
  sec: [
    { h: "Proposals and client emails", p: "Write proposals, cold emails and follow-ups that sound like you.", tools: ["ChatGPT", "Claude", "Grammarly", "Lavender"] },
    { h: "Faster delivery", p: "Design, code and write faster with AI assistants.", tools: ["Canva", "Cursor", "GitHub Copilot", "Gamma"] },
    { h: "Invoices and GST", p: "Professional GST invoices and payment reminders.", tools: ["Zoho Books", "Swipe", "myBillBook"] },
    { h: "Getting work", p: "Polish your LinkedIn and portfolio, and build a simple website.", tools: ["Taplio", "Durable", "Framer", "Kickresume"] }
  ],
  why: {
    "ChatGPT": "Proposals and emails in your voice. Paste a past one as a sample.",
    "Claude": "Careful long-form writing for reports and proposals.",
    "Grammarly": "Proofreads emails and proposals.",
    "Lavender": "Scores cold emails and suggests edits.",
    "Canva": "Quick designs and presentations.",
    "Cursor": "Code editor with an AI assistant for developers.",
    "GitHub Copilot": "Code suggestions inside your editor.",
    "Gamma": "Turns an outline into a client deck.",
    "Zoho Books": "GST invoices and payment reminders. Has a free plan, so check the limits.",
    "Swipe": "GST invoicing app with payment reminders.",
    "myBillBook": "Simple GST bills from a phone.",
    "Taplio": "LinkedIn post ideas and scheduling.",
    "Durable": "Builds a simple website in minutes.",
    "Framer": "Design-led portfolio sites.",
    "Kickresume": "Resume and portfolio builder."
  },
  tip: ["Save your best proposal and reuse it with AI for each client", "Send every invoice from one tool", "Post on LinkedIn twice a week"],
  faq: [["Do I need GST registration?", "It depends on your turnover and clients. Check with a CA. Tools like Zoho Books handle GST invoices when you need them."], ["Will clients mind AI use?", "Most care about quality and deadlines. Be open about it when asked."]]
},
{
  s: "content-creators", t: "Best AI Tools for YouTubers and Content Creators in India", who: "YouTubers, Instagram creators and podcasters",
  i: "Scripts, editing, thumbnails and captions take most of a creator's time. These AI tools speed up every step, including dubbing into Indian languages.",
  sec: [
    { h: "Scripts and ideas", p: "Research topics, outline videos and write hooks.", tools: ["ChatGPT", "Claude", "Perplexity", "Gemini"] },
    { h: "Editing and shorts", p: "Auto-cut long videos into shorts, add captions and clean audio.", tools: ["CapCut", "Opus Clip", "Descript", "Adobe Podcast"] },
    { h: "Thumbnails and graphics", p: "Eye-catching thumbnails and channel art.", tools: ["Canva", "Ideogram", "Photoroom", "Leonardo AI"] },
    { h: "Voice and dubbing", p: "Voiceovers and dubbing into Hindi, Telugu and other languages.", tools: ["ElevenLabs", "Sarvam AI", "Rask AI", "HeyGen Translate"] }
  ],
  why: {
    "ChatGPT": "Outlines, hooks and title ideas.",
    "Claude": "Careful script writing and rewriting.",
    "Perplexity": "Research with sources you can open.",
    "Gemini": "Free option for ideas and quick research.",
    "CapCut": "Free to start, with auto-captions.",
    "Opus Clip": "Cuts long videos into short clips with captions.",
    "Descript": "Edit video by editing the transcript.",
    "Adobe Podcast": "Cleans noisy voice recordings.",
    "Canva": "Thumbnails and channel art from templates.",
    "Ideogram": "Good at text inside images, useful for thumbnails.",
    "Photoroom": "Cuts out subjects for thumbnails.",
    "Leonardo AI": "Generates custom thumbnail and background art.",
    "ElevenLabs": "Natural voiceovers, with Hindi and other Indian languages.",
    "Sarvam AI": "Voice and text tools built for Indian languages.",
    "Rask AI": "Dubs videos into other languages.",
    "HeyGen Translate": "Dubs video into other languages with lip-sync."
  },
  tip: ["Turn every long video into 3 to 5 shorts with Opus Clip", "Clean every voice track with Adobe Podcast", "Test dubbing one video into a second language"],
  faq: [["Does YouTube allow AI content?", "Yes, but you must disclose realistic AI-made content when uploading."], ["Which editor is best on a phone?", "CapCut. It is free to start and has auto-captions."]]
},
{
  s: "travel-agents", t: "Best AI Tools for Travel Agents in India", who: "travel agents and tour operators",
  i: "Itineraries, quotes and quick WhatsApp replies win travel bookings. These AI tools make itineraries in minutes and keep every lead warm.",
  sec: [
    { h: "Itineraries and quotes", p: "Draft day-by-day itineraries and neat PDF quotes.", tools: ["ChatGPT", "Gemini", "Wanderlog AI", "Canva"] },
    { h: "Destination research", p: "Visa rules, weather and local tips, with sources to check.", tools: ["Perplexity", "Mindtrip", "Layla Travel"] },
    { h: "Leads and WhatsApp", p: "Reply to enquiries, send packages and payment reminders.", tools: ["AiSensy", "Wati", "Gallabox"] },
    { h: "Reels and ads", p: "Destination reels and ad creatives.", tools: ["CapCut", "InVideo", "AdCreative.ai"] }
  ],
  why: {
    "ChatGPT": "Day-by-day itineraries and quote text. Check prices and timings.",
    "Gemini": "Free option for itineraries and translation.",
    "Wanderlog AI": "Plans routes on a map.",
    "Canva": "Neat PDF quotes and package posters.",
    "Perplexity": "Sourced answers. Open the source for visa rules.",
    "Mindtrip": "AI trip planner for destination ideas.",
    "Layla Travel": "AI travel assistant for trip ideas.",
    "AiSensy": "Sends packages and payment reminders on WhatsApp.",
    "Wati": "Shared WhatsApp inbox for your sales team.",
    "Gallabox": "WhatsApp inbox with chatbot flows for enquiries.",
    "CapCut": "Destination reels from phone clips.",
    "InVideo": "Turns a script into a promo video.",
    "AdCreative.ai": "Generates ad creatives for campaigns."
  },
  tip: ["Make one itinerary template and reuse it with AI", "Always verify visa and fare details on official sites", "Send a package of the week on WhatsApp"],
  faq: [["Can AI book tickets?", "Not reliably. Use AI for planning and quotes, and book on your usual systems."], ["Are AI travel facts accurate?", "Not always. Check visas, fares and timings on official sources."]]
},
{
  s: "gyms", t: "Best AI Tools for Gyms and Fitness Trainers in India", who: "gyms, fitness studios and personal trainers",
  i: "Member retention and a steady social presence keep a gym full. These AI tools help with workout plans, renewals and reels.",
  sec: [
    { h: "Workout and diet plans", p: "Draft personalised workout and Indian diet plans for trainers to review.", tools: ["ChatGPT", "Gemini", "Fitbod", "Healthify"] },
    { h: "Renewals and reminders", p: "Fee reminders, renewal offers and class updates on WhatsApp.", tools: ["AiSensy", "Interakt"] },
    { h: "Reels and transformations", p: "Workout reels and before-after stories.", tools: ["CapCut", "Captions", "Canva"] },
    { h: "Billing", p: "GST bills and membership records.", tools: ["myBillBook", "Swipe", "Zoho Books"] }
  ],
  why: {
    "ChatGPT": "Drafts workout and diet plans for trainers to review.",
    "Gemini": "Free option for plan drafts and Indian meal ideas.",
    "Fitbod": "Builds strength workouts that adapt to progress.",
    "Healthify": "Food logging with Indian dishes.",
    "AiSensy": "Fee reminders and renewal offers on WhatsApp.",
    "Interakt": "Shared WhatsApp inbox for member queries.",
    "CapCut": "Workout reels with auto-captions.",
    "Captions": "Auto-captions for trainer videos.",
    "Canva": "Offer posters and transformation cards.",
    "myBillBook": "GST bills and membership records from a phone.",
    "Swipe": "Alternative for GST invoicing.",
    "Zoho Books": "Fuller accounting for larger gyms."
  },
  tip: ["Send renewal reminders 7 days before expiry", "Post one workout reel a day", "Review every AI diet plan before sharing"],
  faq: [["Is AI diet advice safe?", "Use it as a draft. A trainer or nutritionist should review it, especially for members with health conditions."], ["Best free tool for reels?", "CapCut."]]
},
{
  s: "photographers", t: "Best AI Tools for Photographers and Studios in India", who: "wedding photographers and studios",
  i: "Culling, editing and album delivery take more time than the shoot. These AI tools cut editing hours and help you market your work.",
  sec: [
    { h: "Editing and retouching", p: "Fast retouching, upscaling and background clean-up.", tools: ["Luminar Neo", "Topaz Photo AI", "Photopea", "Let's Enhance"] },
    { h: "Object removal and fixes", p: "Remove people and objects and fix old photos.", tools: ["Cleanup.pictures", "Remini", "Picsart AI"] },
    { h: "Reels and teasers", p: "Wedding teasers and reels with music.", tools: ["CapCut", "Descript", "Beatoven"] },
    { h: "Clients and bookings", p: "Quotes, contracts and delivery updates on WhatsApp.", tools: ["ChatGPT", "AiSensy", "Canva"] }
  ],
  why: {
    "Luminar Neo": "AI editing and retouching tools for photographers.",
    "Topaz Photo AI": "Sharpens and upscales photos.",
    "Photopea": "Free browser editor similar to Photoshop.",
    "Let's Enhance": "Upscales low-resolution photos.",
    "Cleanup.pictures": "Removes people and objects from photos.",
    "Remini": "Restores old and blurry photos.",
    "Picsart AI": "Quick edits and fixes on a phone.",
    "CapCut": "Wedding teasers and reels.",
    "Descript": "Edit video by editing the transcript.",
    "Beatoven": "Generates royalty-free background music for your clip length and mood.",
    "ChatGPT": "Drafts quotes, contracts and client emails.",
    "AiSensy": "Delivery and album updates on WhatsApp.",
    "Canva": "Price lists and album covers."
  },
  tip: ["Build an editing preset and let AI do first passes", "Deliver a 60-second teaser within 48 hours", "Use Beatoven for copyright-safe background music"],
  faq: [["Will AI replace editing?", "It removes repetitive work. Your style and final choices still sell the work."], ["Is AI music safe for reels?", "Use tools with clear commercial licences and check each one's terms."]]
},
{
  s: "hotels-homestays", t: "Best AI Tools for Hotels and Homestays in India", who: "small hotels, homestays and resorts",
  i: "Guests choose from photos and reviews and expect quick replies. These AI tools help small properties look better online and answer guests fast.",
  sec: [
    { h: "Photos and videos", p: "Brighter room photos and short property tours.", tools: ["Let's Enhance", "Photoroom", "CapCut"] },
    { h: "Guest messages", p: "Booking confirmations, check-in details and local tips on WhatsApp.", tools: ["AiSensy", "Wati", "Gallabox"] },
    { h: "Reviews and listings", p: "Reply to reviews and improve OTA listing descriptions.", tools: ["ChatGPT", "Gemini", "Grammarly"] },
    { h: "Website and social", p: "A simple direct-booking website and regular posts.", tools: ["Durable", "Wix ADI", "Canva", "Buffer AI"] }
  ],
  why: {
    "Let's Enhance": "Upscales and brightens room photos.",
    "Photoroom": "Cleans up photos for listings.",
    "CapCut": "Short property tour reels.",
    "AiSensy": "Booking confirmations and check-in details on WhatsApp.",
    "Wati": "Shared WhatsApp inbox for front-desk staff.",
    "Gallabox": "WhatsApp inbox with chatbot flows for guest queries.",
    "ChatGPT": "Drafts review replies and OTA listing descriptions.",
    "Gemini": "Free option for review replies and local-tip guides.",
    "Grammarly": "Polishes guest emails and listings.",
    "Durable": "Builds a direct-booking website in minutes.",
    "Wix ADI": "Wix's AI website builder.",
    "Canva": "Posters, offer cards and Instagram posts.",
    "Buffer AI": "Schedules posts and drafts captions."
  },
  tip: ["Reply to every review within a day", "Send a check-in guide on WhatsApp before arrival", "Refresh listing photos every season"],
  faq: [["Can AI reply to reviews?", "It can draft them. Add a personal line before posting."], ["How do I get direct bookings?", "A simple website plus WhatsApp booking, promoted on Instagram and Google."]]
},
{
  s: "msme-manufacturers", t: "Best AI Tools for MSME Manufacturers and Traders in India", who: "MSME manufacturers, traders and distributors",
  i: "For small factories and traders, AI is most useful in paperwork, quotes, catalogues and data, not on the shop floor.",
  sec: [
    { h: "Accounts, GST and inventory", p: "GST billing, stock and receivables in one place.", tools: ["TallyPrime", "Zoho Books", "Clear", "myBillBook"] },
    { h: "Quotes, catalogues and emails", p: "Product catalogues, quotes and export emails.", tools: ["ChatGPT", "Canva", "Gamma", "DeepL"] },
    { h: "Data and reports", p: "Sales and production reports from Excel data.", tools: ["GPT for Sheets", "Julius AI", "Power BI Copilot"] },
    { h: "B2B leads", p: "Find buyers and follow up.", tools: ["Apollo.io", "AiSensy", "Zapier"] }
  ],
  why: {
    "TallyPrime": "Standard accounting and GST software for Indian traders and factories.",
    "Zoho Books": "Cloud accounting with GST and a free plan to start.",
    "Clear": "GST filing and reconciliation.",
    "myBillBook": "Phone-first billing and stock for small units.",
    "ChatGPT": "Drafts quotes, product descriptions and emails.",
    "Canva": "Product catalogues and price lists.",
    "Gamma": "Turns an outline into a catalogue or company deck.",
    "DeepL": "Accurate translation for export emails.",
    "GPT for Sheets": "Cleans and summarises data inside Google Sheets.",
    "Julius AI": "Upload a spreadsheet and ask for sales and production summaries.",
    "Power BI Copilot": "Reports and dashboards from your data. Needs a Power BI setup.",
    "Apollo.io": "Finds B2B buyer contacts.",
    "AiSensy": "Sends quotes and follow-ups on WhatsApp.",
    "Zapier": "Connects forms, sheets and WhatsApp so follow-ups go out automatically."
  },
  tip: ["Make a PDF product catalogue with Canva or Gamma", "Get a weekly sales summary from your Excel data with AI", "Use DeepL for export emails"],
  faq: [["Where should a factory start with AI?", "Paperwork first: quotes, catalogues and reports. These give quick wins with no risk to production."], ["Is Tally enough?", "For accounts, yes. Add AI tools on top for reports and documents."]]
},
{
  s: "interior-designers", t: "Best AI Tools for Interior Designers in India", who: "interior designers and architects",
  i: "Clients want to see the idea before they pay. These AI tools help designers show concepts quickly and present them well.",
  sec: [
    { h: "Concepts and mood boards", p: "Generate room concepts and mood boards from a brief.", tools: ["Midjourney", "Leonardo AI", "Krea", "Canva"] },
    { h: "3D and walkthroughs", p: "Simple 3D models and scans of spaces.", tools: ["Polycam", "Spline 3D", "Meshy"] },
    { h: "Presentations and quotes", p: "Client decks and detailed quotes.", tools: ["Gamma", "ChatGPT"] },
    { h: "Marketing", p: "Before-after reels and project posts.", tools: ["CapCut", "Predis.ai", "Photoroom"] }
  ],
  why: {
    "Midjourney": "High-quality room concepts from a text brief.",
    "Leonardo AI": "Concept images with a free plan.",
    "Krea": "Real-time image generation for quick concept iteration.",
    "Canva": "Mood boards and presentations.",
    "Polycam": "Scans rooms with a phone camera into 3D models.",
    "Spline 3D": "Simple 3D scenes in the browser.",
    "Meshy": "Generates 3D models from text or images.",
    "Gamma": "Turns an outline into a client deck.",
    "ChatGPT": "Drafts quotes and client emails.",
    "CapCut": "Before-and-after project reels.",
    "Predis.ai": "Project post captions and a posting plan.",
    "Photoroom": "Cleans up project and product photos."
  },
  tip: ["Show 3 AI concepts in the first meeting", "Scan sites with Polycam on your phone", "Post every finished project as a reel"],
  faq: [["Can AI concepts be built as shown?", "Treat them as inspiration. Final drawings need real measurements and materials."], ["Best free tool?", "Canva and Leonardo AI have free plans."]]
}
];
