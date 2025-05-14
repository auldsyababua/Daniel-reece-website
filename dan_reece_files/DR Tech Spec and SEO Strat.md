## **Executive Speech Coaching Website \- Design Spec**

### **1  Overview**

A professional, conversion‑focused platform for Daniel Reece—NYC actor & executive speech coach—to attract high‑value clients (executives, professionals, performers), reinforce authority (blog, testimonials, media), and provide friction‑free booking/inquiry.

---

### **2  Requirements**

**Functional**

* **MUST** Hugo‑based responsive site (Tailbliss theme)  
* **MUST** Core pages: Home · About · Services · Media · Blog · Testimonials · Contact · Booking  
* **MUST** Booking & contact forms integrated with Airtable  
* **MUST** Schema markup: `Person`, `LocalBusiness`, `Service`, `FAQ`  
* **SHOULD** Payment integration (Stripe)

**Non‑Functional**

* **MUST** Core Web Vitals – LCP \< 2.5 s, CLS \< 0.1, **INP** \< 200 ms  
* **MUST** HTTPS, GDPR compliance, input validation, rate limiting, security headers  
* **SHOULD** Accessibility (WCAG AA)  
* **MUST** Modern browser support (desktop & mobile)

---

### **3  Architecture Overview**

@startuml

actor User

User \--\> Website : browse | book

Website \--\> Flask API : contact / booking

Flask API \--\> Airtable : log lead

Flask API \--\> Gmail : notify

Flask API \--\> Zapier : trigger workflows

@enduml

---

### **4  Technology Stack**

| Layer | Tech |
| ----- | ----- |
| **Static Site** | Hugo \+ Tailbliss (Tailwind CSS · Alpine.js) |
| **Backend API** | Flask (Replit) |
| **Data** | Airtable (Clients & Zapier Log) |
| **Automation** | Zapier (webhooks) |
| **Payments** | Stripe (optional) |
| **Hosting** | Replit \+ Cloudflare CDN |

---

### **5  Frontend Details**

* **Pages** `/` `/about` `/services/*` `/media` `/blog` `/testimonials` `/contact` `/booking`  
* **Reusable components** HeroBanner · ServiceCard · BookingWidget · TestimonialSlider · BlogPreview · CTAStickyBar  
* **Design** Professional, modern; Deep Navy \#0a1a2b, Gold/Orange \#ffb400, White. Mobile‑first layout, high contrast, strong CTAs.

---

### **6  Backend Details**

**Endpoints**

* `POST /api/contact` → Gmail relay  
* `POST /api/log-lead` → Airtable Clients  
* `POST /api/zapier/lead-created`  
* `POST /api/zapier/session-booked`  
* `POST /api/zapier/session-completed`

**Security** `X‑API‑Key` header · HTTPS · JSON input validation. Logs in JSON or Airtable. Rate limiting via Flask‑Limiter.

---

### **7  SEO & Analytics**

* Schema.org JSON‑LD on all structured content  
* Auto‑generated `sitemap.xml` & `robots.txt`  
* Manual SEO titles & meta descriptions per page  
* Blog content optimized for long‑tail keywords; FAQPage schema on service pages  
* Google Analytics 4 & Search Console

---

### **8  CMS / Admin**

Airtable serves as lightweight CRM & CMS (views for “Needs Follow‑up”, “New Inquiry”). Optional Netlify CMS for blog markdown.

---

### **9  DevOps**

* Git‑based deployment (Replit)  
* Cloudflare CDN & DNS  
* JSON logging \+ optional webhook alerts

---

### **10  Testing Strategy**

* Playwright E2E (routes, forms, booking)  
* Axe‑core accessibility scans  
* Lighthouse for Core Web Vitals  
* Markdown/content linting pre‑deploy

---

### **11  Content Strategy**

* Authoritative, human tone  
* Content types: service copy · blog · testimonials  
* Example blog ideas: *Executive Speaking Mistakes* · *Stage Presence for Professionals*  
* Encourage video testimonials & case studies

---

### **12  Legal & Compliance**

Privacy Policy · Terms · Cookie consent banner. Fonts and imagery fully licensed or owned.

---

### **13  Project Management**

**Phases (order only)**  
1 Spec Lock → 2 Build Core → 3 Add Content → 4 Testing & SEO → 5 Launch

**Risks** integration delays · deliverability issues · SEO indexing

---

### **14  Appendices**

#### **Documentation Links**

| Stack Item | Official Documentation |
| ----- | ----- |
| **Hugo** | [https://gohugo.io/documentation/](https://gohugo.io/documentation/) |
| **Tailwind CSS** | [https://tailwindcss.com/docs](https://tailwindcss.com/docs) |
| **Alpine.js** | [https://alpinejs.dev/start](https://alpinejs.dev/start) |
| **Tailbliss Theme** | [https://github.com/Tailbliss/tailbliss](https://github.com/Tailbliss/tailbliss) |
| **Flask** | [https://flask.palletsprojects.com/](https://flask.palletsprojects.com/) |
| **Replit** | [https://docs.replit.com/](https://docs.replit.com/) |
| **Airtable** | [https://airtable.com/developers](https://airtable.com/developers) |
| **Zapier (Webhooks & Zaps)** | [https://platform.zapier.com/docs/triggers-webhooks](https://platform.zapier.com/docs/triggers-webhooks) |
| **Netlify CMS** | [https://www.netlifycms.org/docs/](https://www.netlifycms.org/docs/) |
| **Stripe** | [https://stripe.com/docs](https://stripe.com/docs) |
| **Calendly API** | [https://developer.calendly.com/](https://developer.calendly.com/) |
| **Cloudflare (Workers \+ CDN)** | [https://developers.cloudflare.com/](https://developers.cloudflare.com/) |
| **Playwright** | [https://playwright.dev/docs/intro](https://playwright.dev/docs/intro) |
| **axe‑core** | [https://www.deque.com/axe/core-documentation/](https://www.deque.com/axe/core-documentation/) |
| **Google Analytics 4** | [https://support.google.com/analytics/answer/10089681](https://support.google.com/analytics/answer/10089681) |
| **Google Search Console** | [https://support.google.com/webmasters/answer/9128668](https://support.google.com/webmasters/answer/9128668) |

---

### **15  Keyword Targets**

**High‑Value / High‑Competition**

| Keyword | Intent | Notes |
| ----- | ----- | ----- |
| speech coach NYC | Commercial (local) | Core money term—highest competition |
| public speaking coach NYC | Commercial (local) | Strong lead driver; optimize service page \+ GBP |
| public speaking classes NYC | Transactional (local) | Compete with class‑based rivals; needs dedicated class page |
| accent reduction NYC | Commercial (local) | High CPC; leverage accent service page \+ testimonials |
| executive communication coach | Commercial (national) | Targets corporate budgets; case‑study content helpful |
| online speech coach | Commercial (national) | Capture remote prospects; optimize new "Online Coaching" page |
| voice coach New York | Informational/Commercial | Overlaps with vocal coaching sites—needs semantic coverage |

**Low‑Hanging‑Fruit (Opportunity Gaps)**

| Keyword | Estimated Diff. | Rationale |
| ----- | ----- | ----- |
| impromptu speaking coach | Low | Few optimized pages; create tip blog \+ service subsection |
| speech anxiety coaching | Low | Competitors ignore mental aspect; publish guide & FAQ |
| storytelling coach for executives | Medium | Align with data‑storytelling offering; long‑form pillar post |
| data storytelling training NYC | Medium | Combine analytics \+ speaking niche; target B2B teams |
| corporate presentation skills workshop | Low | Service page & LinkedIn articles can rank quickly |
| remote accent reduction sessions | Low | Long‑tail remote query—optimized for international leads |
| stage presence coaching for professionals | Medium | Differentiate from acting schools; case‑study content |
| zoom presentation coach | Low | Pandemic‑driven term; competitors have thin content |

*Approach:* Prioritize publishing pillar pages for high‑competition terms while scheduling 2–3 blog posts per month targeting the low‑hanging‑fruit list to capture quick wins and build topical authority.

---

### 16  Content Pillars  ​​To create a pillar content strategy for the website and its listed services, we’ll structure the content into core pillar pages (broad, high-level content that targets main topics) and cluster content pages (more focused subtopics or service-specific pages that link back to the pillars). This structure is essential for both user navigation and SEO, particularly for ranking in Google’s semantic search environment.

### ---

## 🧱 Pillar Content Strategy Outline  

| Pillar | Page URL | Targeted Keyword | H1/Title | Meta Title | Meta Description |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **Communication Skills & Public Speaking** | **/services/public-speaking** | **public speaking coaching** | **Master the Art of Public Speaking** | **Public Speaking Coaching | Speak with Confidence** | **Unlock your potential with expert public speaking coaching. Build confidence, engage your audience, and make an impact.** |
| **Presentation Skills** | **/services/presentation-skills** | **presentation skills training** | **Sharpen Your Presentation Skills** | **Presentation Skills Training | Present Like a Pro** | **Enhance your delivery and influence with our expert-led presentation skills training programs.** |
| **Cross-Cultural & Inclusive Communication** | **/services/cross-cultural-communication** | **cross-cultural communication training** | **Effective Cross-Cultural Communication** | **Cross-Cultural Communication Training** | **Bridge cultural gaps and communicate effectively across cultures with our specialized coaching.** |
| **Voice, Speaking Style & Personal Branding** | **/services/speaking-voice-enhancement** | **voice enhancement for speakers** | **Enhance Your Speaking Voice** | **Voice Enhancement Coaching for Speakers** | **Refine your voice, improve clarity, and command attention with our voice enhancement coaching.** |
| **Professional Success Through Communication** | **/services/interview-skills** | **interview skills training** | **Ace Your Next Interview** | **Interview Skills Training | Land the Job** | **Stand out in interviews with our expert training in answering tough questions and presenting your best self.** |

### 

### 🌐 Pillar 1: Communication Skills & Public Speaking

### Main Page: “Mastering Communication for Personal and Professional Impact”

#### Cluster Content:

* ### `/services/public-speaking`

* ### `/services/presentation-skills`

* ### `/services/impromptu-speaking`

* ### `/services/preparation-for-a-speech`

* ### `/services/virtual-communications`

* ### `/services/speech-writing`

* ### `/services/executive-presence`

### Keywords: public speaking coaching, improve presentation skills, executive presence training, virtual speaking tips  

| Page URL | Targeted Keyword | H1/Title | Meta Title | Meta Description |
| :---- | :---- | :---- | :---- | :---- |
| /services/public-speaking | public speaking coaching | Master the Art of Public Speaking | Public Speaking Coaching | Speak with Confidence | Unlock your potential with expert public speaking coaching. Build confidence, engage your audience, and make an impact. |
| /services/presentation-skills | presentation skills training | Sharpen Your Presentation Skills | Presentation Skills Training | Present Like a Pro | Enhance your delivery and influence with our expert-led presentation skills training programs. |
| /services/impromptu-speaking | impromptu speaking training | Think Fast, Speak Confidently | Impromptu Speaking Coaching | Speak on the Spot | Develop quick-thinking skills and articulate ideas clearly with our impromptu speaking sessions. |
| /services/preparation-for-a-speech | speech preparation coaching | Prepare for Your Big Speech | Speech Preparation Coaching | Be Speech-Ready | From writing to rehearsal, get expert guidance to deliver powerful speeches with confidence. |
| /services/virtual-communications | virtual communication skills | Excel in Virtual Communication | Virtual Communication Skills Training | Master the art of online meetings, presentations, and interviews with our virtual communication coaching. |
| /services/speech-writing | speech writing help | Professional Speech Writing Services | Speech Writing Help | Craft Memorable Speeches | Get expert help to write impactful speeches tailored to any audience or occasion. |
| /services/executive-presence | executive presence coaching | Boost Your Executive Presence | Executive Presence Coaching | Lead with Authority | Learn how to project confidence, command respect, and inspire teams through executive presence. |

### ---

### 🌍 Pillar 2: Cross-Cultural & Inclusive Communication

### Main Page: “Cross-Cultural & Inclusive Speech: Communicate with Confidence in Any Setting”

#### Cluster Content:

* ### `/services/cross-cultural-communication`

* ### `/services/accent-modification`

* ### `/services/dialect-coaching`

* ### `/services/transgender-speech`

* ### `/services/for-actors`

### Keywords: cross-cultural communication training, reduce accent, dialect coaching, LGBTQ+ voice coaching  

| Page URL | Targeted Keyword | H1/Title | Meta Title | Meta Description |
| :---- | :---- | :---- | :---- | :---- |
| /services/cross-cultural-communication | cross-cultural communication training | Effective Cross-Cultural Communication | Cross-Cultural Communication Training | Bridge cultural gaps and communicate effectively across cultures with our specialized coaching. |
| /services/accent-modification | accent modification coaching | Refine Your Accent for Clarity | Accent Modification Training | Speak Clearly | Improve speech clarity and reduce your accent while retaining your unique identity. |
| /services/transgender-speech | transgender voice coaching | Authentic Voice Coaching for Transgender Individuals | Transgender Voice Coaching | Express Your True Self | Voice training tailored to help transgender clients express their identity confidently and authentically. |
| /services/for-actors | speech training for actors | Voice & Speech Coaching for Actors | Speech Training for Actors | Elevate Your Performance | Enhance your vocal performance, clarity, and presence with actor-focused speech coaching. |
| /services/dialect-coaching | dialect coaching | Master Any Dialect with Ease | Dialect Coaching Services | Speak Like a Local | Learn regional or international dialects for stage, screen, or authenticity in communication. |

### ---

### 🗣️ Pillar 3: Voice, Speaking Style & Personal Branding

### Main Page: “Finding Your Voice: Speak Authentically & Be Remembered”

#### Cluster Content:

* ### `/services/speaking-voice-enhancement`

* ### `/services/voiceover-podcast-training`

* ### `/services/media-training`

* ### `/services/impressions-stand-up-comedy`

* ### `/services/pageant-coaching`

* ### `/services/social-dating-coaching`

### Keywords: voice training for speakers, podcast voice training, media presence training, dating communication tips  

| Page URL | Targeted Keyword | H1/Title | Meta Title | Meta Description |
| :---- | :---- | :---- | :---- | :---- |
| /services/speaking-voice-enhancement | voice enhancement for speakers | Enhance Your Speaking Voice | Voice Enhancement Coaching for Speakers | Refine your voice, improve clarity, and command attention with our voice enhancement coaching. |
| /services/voiceover-podcast-training | podcast voice training | Voiceover and Podcast Voice Training | Podcast Voice Coaching | Sound Professional | Develop a powerful podcast or voiceover voice with expert coaching for clarity, tone, and style. |
| /services/media-training | media training for professionals | Master Media Appearances | Media Training for Professionals | Be Camera-Ready | Learn how to handle interviews, press, and public appearances with poise and impact. |
| /services/impressions-stand-up-comedy | comedy voice coaching | Voice Coaching for Comedy & Impressions | Comedy Voice Training | Master Your Stage Voice | Stand out with unique vocal techniques for stand-up comedy and celebrity impressions. |
| /services/pageant-coaching | pageant speech coaching | Pageant Speech & Voice Coaching | Pageant Coaching | Shine On Stage | Boost your confidence, poise, and communication for pageants with expert coaching. |
| /services/social-dating-coaching | social and dating communication | Confident Communication in Social & Dating Life | Social & Dating Coaching | Speak with Confidence | Enhance your social presence and dating communication skills through personalized coaching. |

### ---

### 💼 Pillar 4: Professional Success Through Communication

### Main Page: “Communicate for Career Success: From Interviews to Sales Mastery”

#### Cluster Content:

* ### `/services/interview-skills`

* ### `/services/sales-training`

* ### `/services/customer-service`

### Keywords: interview skills coaching, sales communication training, customer service voice training  

| Page URL | Targeted Keyword | H1/Title | Meta Title | Meta Description |
| :---- | :---- | :---- | :---- | :---- |
| /services/interview-skills | interview skills training | Ace Your Next Interview | Interview Skills Training | Land the Job | Stand out in interviews with our expert training in answering tough questions and presenting your best self. |
| /services/sales-training | sales communication training | Master the Art of Persuasive Sales | Sales Training | Communicate to Close | Develop persuasive communication techniques that boost conversions and client engagement. |
| /services/customer-service | customer service voice training | Communicate Effectively in Customer Service | Customer Service Communication Coaching | Deliver exceptional service and build rapport through voice and emREDACTED_AIRTABLE_PAT-focused communication training. |

### ---

## 🧭 Strategy Recommendations

1. ### Internal Linking:

   * ### Each service page should link back to its respective pillar page using keyword-rich anchor text.

   * ### Pillar pages should include summaries and internal links to each cluster content page.

2. ### Content Depth & Format:

   * ### Use long-form content on pillar pages (1500-3000 words) to cover the full scope of the topic.

   * ### Include multimedia (video clips, voice samples, testimonials, charts) to improve user engagement and time on site.

3. ### Top-of-Funnel SEO Focus:

   * ### Use blog posts or educational guides to drive organic traffic to each pillar (e.g., “10 Tips to Reduce Your Accent Naturally”).

4. ### Schema Markup:

   * ### Use FAQ, Service, and LocalBusiness schema on individual service pages to boost visibility in rich results.

5. ### Optimize for Intent:

   * ### Match user intent: Informational content for blog/pillar, transactional on service pages.

### ---

