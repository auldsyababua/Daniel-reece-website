# **Comprehensive SEO Audit for NewYorkSpeechCoaching.com**

## **Technical SEO Audit (Site Architecture & Crawlability)**

**Site Structure & URLs:** The site is well-structured into logical sections (services, team, contact, locations). All important pages (e.g. individual service pages for Public Speaking, Accent Reduction, etc.) should be easily discoverable via navigation and internal links. Ensure a clear hierarchy – e.g. one primary **H1** heading per page and descriptive URLs. Currently, URLs are clean and descriptive (e.g. `/services/accent-modification`). This is good for crawlability and user understanding.

**Crawlability & Indexing:** No major crawling issues are apparent. A `robots.txt` file should be present allowing all core pages. Confirm that an XML sitemap is submitted to Google; a sitemap acts as a roadmap to ensure Google finds all essential pages ([What is an XML sitemap and why should you have one? • Yoast](https://yoast.com/what-is-an-xml-sitemap-and-why-should-you-have-one/#:~:text=An%20XML%20sitemap%20is%20a,help%20speed%20up%20content%20discovery)). If not already done, create a sitemap listing all main pages (including location-specific pages like `/georgia` and `/dc`) and update it whenever new content is added. This will help search engines discover content that isn’t heavily linked internally (for instance, the “Press Resources” section if it’s not linked prominently). Verify that the site is being indexed properly in Google Search Console – all key pages should have **Status: Index**. There appear to be no “noindex” tags on important pages, which is correct.

**Mobile-First Indexing:** Google uses the mobile version of websites for indexing and ranking ([A Complete Guide To Mobile-First Indexing | Go Fish Digital](https://gofishdigital.com/blog/mobile-first-indexing/#:~:text=Yes%2C%20mobile,%E2%80%9C)). The site is responsive, but we must ensure the mobile version contains all the same critical content and links as desktop. A quick check shows the content is the same on mobile (no truncated sections). This is important because if the mobile experience is poor or content-light, rankings can suffer ([A Complete Guide To Mobile-First Indexing | Go Fish Digital](https://gofishdigital.com/blog/mobile-first-indexing/#:~:text=Yes%2C%20mobile,%E2%80%9C)). Overall, the site should maintain a mobile-friendly design (more in **Mobile SEO**below).

**Core Web Vitals & Page Speed:** PageSpeed and user experience metrics need attention. Google’s Core Web Vitals – Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS), and Interaction to Next Paint (INP, replacing First Input Delay) – are ranking factors ([Are Core Web Vitals A Ranking Factor? | DebugBear](https://www.debugbear.com/docs/core-web-vitals-ranking-factor#:~:text=Google%20has%20confirmed%20that%20page,will%20get%20less%20organic%20traffic)). If the site has subpar scores (e.g. LCP above 2.5s or noticeable layout shifts), it could be hurting organic performance. A test of the homepage shows room for improvement in LCP and CLS. High-resolution images and possibly unminified JS/CSS seem to be slowing load times. We recommend optimizing these elements for faster loads.

*Table: Indicative Page Speed Metrics.* (Exact values should be verified with Google PageSpeed Insights). **Recommendation:** Compress and resize images (many hero/background images can be optimized without visible quality loss), enable text compression (Gzip/Brotli), and use browser caching. These optimizations will improve LCP. Reducing any render-blocking scripts or CSS will also help first paint times. Core Web Vitals are increasingly important in SEO, so improving these will not only enhance user experience but also provide a ranking boost over time ([Are Core Web Vitals A Ranking Factor? | DebugBear](https://www.debugbear.com/docs/core-web-vitals-ranking-factor#:~:text=Google%20has%20confirmed%20that%20page,will%20get%20less%20organic%20traffic)).

**Structured Data:** Currently, the site does not appear to use structured data markup on its pages. Implementing **LocalBusiness schema** on the contact page and location pages is highly recommended. Structured data helps search engines understand site content better and can enable rich results (e.g. business Knowledge Panel details) ([Structured Data and SEO Best Practices](https://www.positional.com/blog/structured-data-seo#:~:text=Structured%20data%20is%20crucial%20because,through%20rates%20%28CTR)) ([Local SEO Schema: A Complete Guide To Local Structured Data & Rich Results](https://www.searchenginejournal.com/how-to-use-schema-for-local-seo-a-complete-guide/294973/#:~:text=Data%20And%20Google%20Business%20Profile)). For example, adding JSON-LD for `LocalBusiness` with details like name, address, phone, and business hours will reinforce the NAP information to Google. This markup does not directly boost rankings, but it can improve how your listings appear (and ensures consistency with Google Business Profile data) ([Local SEO Schema: A Complete Guide To Local Structured Data & Rich Results](https://www.searchenginejournal.com/how-to-use-schema-for-local-seo-a-complete-guide/294973/#:~:text=Structured%20data%20on%20a%20location,search%20engines%20interpret%20your%20website)) ([Structured Data and SEO Best Practices](https://www.positional.com/blog/structured-data-seo#:~:text=Structured%20data%20is%20crucial%20because,through%20rates%20%28CTR)). Additionally, if you add an FAQ section to pages (as recommended later), include **FAQPage schema** to become eligible for rich snippet FAQs in results.

**HTTPS & Canonicals:** The site is served on HTTPS, which is good (Google gives a minor ranking preference to secure sites). Ensure that all versions of the site redirect to the single canonical URL (e.g. `http://` to `https://`, and any `www.` to non-`www.`). We noticed `newyorkspeechcoaching.com` is the primary domain; confirm that subdomains like `schedule.newyorkvocalcoaching.com` (for booking) and external domains like `presentingsolutions.com` (corporate training) are properly linked with rel=canonical or cross-domain canonical if needed. For instance, if the same content exists on both the main site and an external domain, use canonical tags to point Google to the preferred version to avoid any duplicate content confusion ([Utilizing Canonical Tags to Avoid Duplicate Content Issues | Rocket Clicks](https://rocketclicks.com/client-education/utilizing-canonical-tags-to-avoid-duplicate-content-issues/#:~:text=HTTP%20headers%20provide%20information%20about,and%20visibility%20in%20search%20results)). Each page on the site should have a self-referencing `<link rel="canonical">` to itself as a best practice to consolidate signals.

**Robots.txt and Indexing Directives:** Double-check the `robots.txt` to ensure no important sections are disallowed. The only areas that should be blocked from crawling are perhaps administrative or booking backend pages if any. All public pages (services, locations, blog if created) should be crawlable. If there are any low-value pages (e.g. certain thin press releases or duplicate printer-friendly pages), consider using `noindex` meta tags on those rather than blocking via robots, since Google **will not index content blocked by robots** (and can’t see a noindex on them). Currently, it appears all main pages are indexable, which is correct.

**Server Response & Errors:** A quick crawl did not find broken links on the main navigation. The site’s 404 page is functional but contains a reference to “Phosis” (likely the site platform or an old framework). This is a minor UX issue – consider customizing the 404 page with helpful links. Also, any broken URLs discovered (for example, if there are outdated press article URLs) should be 301-redirected to the appropriate new URLs or to a relevant page. Regularly run a crawl (using a tool like Screaming Frog) to catch and fix 404 errors.

**Summary (Technical):** The technical foundation is solid – the site is crawlable and mostly indexable. Key improvements lie in performance (page speed) and leveraging technical SEO enhancements (sitemaps, schema, canonicals). By improving load times and Core Web Vitals, the site will meet modern SEO standards for speed, which is not only a ranking factor but also critical for user retention ([Are Core Web Vitals A Ranking Factor? | DebugBear](https://www.debugbear.com/docs/core-web-vitals-ranking-factor#:~:text=Google%20has%20confirmed%20that%20page,will%20get%20less%20organic%20traffic)). Ensuring Google can easily find and interpret all your content (via sitemaps and structured data) will set the stage for the on-page and content optimizations to have maximum impact.

## **On-Page SEO Audit (HTML Elements & Keyword Usage)**

**Title Tags:** The title tags on the site should be reviewed for length, uniqueness, and keyword targeting. Currently, many pages use a format like “Public Speech Coaching | Private & Group Training \> New York Speech Coaching.” While this contains relevant keywords, the use of “\>” is unusual – consider using a dash or pipe for readability (e.g., “Public Speech Coaching – Private & Group Training | New York Speech Coaching”). More importantly, include primary keywords near the start of the title. For example, the “Accent Modification” page could be retitled to explicitly include “Accent Reduction” if that’s the term users search (since both terms are used). Well-crafted titles remain one of the strongest on-page ranking signals ([What Are Title Tags? \[Plus FREE Meta Title Preview Tool\] \- Moz](https://moz.com/learn/seo/title-tag#:~:text=Title%20tags%20are%20vital%20for,experience%20and%20reduced%20bounce%20rates)). Each page should have a unique title under \~60 characters that clearly indicates the page’s topic and includes a keyword and a locational cue if applicable. For instance: **“Accent Reduction Coaching in NYC | New York Speech Coaching”** would target that service \+ location. Optimizing title tags can improve click-through rates and rankings ([What Are Title Tags? \[Plus FREE Meta Title Preview Tool\] \- Moz](https://moz.com/learn/seo/title-tag#:~:text=Title%20tags%20are%20vital%20for,experience%20and%20reduced%20bounce%20rates)).

**Meta Descriptions:** Ensure every page has a custom meta description around 150 characters that entices users to click. While meta descriptions don’t directly influence ranking, they strongly affect CTR (click-through rate) ([What Are Meta Descriptions And How to Write Them \[Free Tools Inside\] \- Moz](https://moz.com/learn/seo/meta-description#:~:text=While%20it%20may%20not%20be,your%20link%20within%20search%20results)). Many of the site’s current meta descriptions appear to be either missing or pulling generic text. For example, the homepage meta description could read: *“New York Speech Coaching offers private speech lessons, public speaking classes, accent reduction training, and more – in NYC or online. Improve clarity, confidence, and vocal presence with world-class coaches.”* This hits key services and value propositions. A compelling description with a call-to-action (“Book your first session today\!”) can improve CTR from Google search results ([What Are Meta Descriptions And How to Write Them \[Free Tools Inside\] \- Moz](https://moz.com/learn/seo/meta-description#:~:text=Add%20a%20CTA)) ([What Are Meta Descriptions And How to Write Them \[Free Tools Inside\] \- Moz](https://moz.com/learn/seo/meta-description#:~:text=,descriptions%20for%20underperforming%20pages%20by)). Audit all pages for duplicate or missing meta descriptions and update them to be unique and descriptive of that page’s content.

**Heading Tags (H1-H6):** Use a clear, **single H1 heading on each page** that includes the primary keyword for the page. It looks like some pages (e.g. homepage) might not have a clear H1 – the homepage’s first visible text “Speak up – with a voice you love.” was coded as an H2 in the HTML snippet. If that’s the case, adjust it to an H1, and use H2 for subheadings like “Our Philosophy,” etc. Headings should form a logical outline: H1 as the page title, H2 for major sections, H3 for subsections, etc. ([How To Use Header Tags: SEO Best Practices](https://www.searchenginejournal.com/on-page-seo/header-tags/#:~:text=,further%20structure%20within%20those%20subsections)). This not only helps SEO but also improves readability. Google’s John Mueller has indicated that header tags send a “really strong signal” about the page’s topics ([How To Use Header Tags: SEO Best Practices](https://www.searchenginejournal.com/on-page-seo/header-tags/#:~:text=Google%E2%80%99s%20guidance%20reinforces%20the%20need,to%20use%20header%20tags%20strategically)). Currently, the service pages list multiple topics (e.g. Executive Presence, Social & Dating Coaching) in a bullet format; ensure each has an appropriate heading and perhaps a brief description (which many do). We recommend reviewing heading usage site-wide: no missing or multiple H1s, and include target phrases in headings where natural. For instance, on the Public Speaking page, an H2 might be “Public Speaking Coaching in New York City” to reinforce the keyword/location.

**Keyword Targeting & Page Content:** Each primary service has its own page – this is excellent for targeting specific keywords. Continue to align each page with one core keyword theme. For example, the **Speaking Voice Enhancement**page content should explicitly mention phrases people search for, like “voice improvement” or “voice coach for speaking” in addition to “speaking voice enhancement,” to cast a wider net. The content on each page should naturally incorporate synonyms and related terms. The current content is high-quality and professional in tone, which is great. We can augment it by integrating more of the language that potential clients use. Keyword research suggests terms like “speech coach NYC,” “public speaking classes NYC,” “accent reduction coach,” etc., have search volume. Ensure these phrases (as appropriate) appear in the copy or as section headings. However, **avoid keyword stuffing** – all additions should read naturally and add value. The goal is to make it crystal clear to both users and Google what each page is about. For example, adding a line on the Accent page like “Our accent reduction coaching in New York City helps you neutralize your accent for clearer communication ([Speech Coaching Services | Classes, Lessons, Workshops \> New York Speech Coaching](https://newyorkspeechcoaching.com/services#:~:text=))” ties in the keyword “accent reduction New York City” while remaining user-friendly.

**Image Optimization:** Many images on the site currently have descriptive filenames/alt text (e.g. we saw `Image: woman with microphone` which likely corresponds to an alt tag). It’s important that **all images have relevant alt text** describing the image or its purpose ([Why Image Alt Text is Important for SEO](https://www.innovationvisual.com/knowledge/why-image-alt-text-is-important-for-seo#:~:text=into%20consideration%20can%20have%20a,alt%20tag%20has%20been%20set)) ([Why Image Alt Text is Important for SEO](https://www.innovationvisual.com/knowledge/why-image-alt-text-is-important-for-seo#:~:text=Fundamentally%2C%20the%20purpose%20of%20alt,for%20all%20your%20websites%20images)). This not only aids accessibility for visually impaired users but also gives search engines additional context (and can help images rank in Google Images). E.g., the headshot of a coach should have alt text like “Brendan Houdek – Senior Speech Instructor at New York Speech Coaching.” Avoid leaving alt attributes blank unless the image is purely decorative. Additionally, compress images to reduce file size (without noticeable quality loss). Large background images (like the blurred lights background) should be optimized – consider using next-gen formats like WebP for further size reduction. Optimizing images will improve load time (benefiting Core Web Vitals) and thereby SEO.

**Internal Linking:** The internal linking structure can be expanded for SEO benefit. The site navigation covers main pages, but within page content you can cross-link relevant topics. For example, the text on the Public Speaking page could link to the Speech Writing page when mentioning “preparing a presentation” (if it doesn’t already). Internal links distribute “link equity” throughout the site and help Google discover pages ([Internal Linking for SEO: A Comprehensive Guide » Rank Math](https://rankmath.com/blog/internal-linking/#:~:text=By%20establishing%20contextual%20relationships%20between,the%20importance%20of%20individual%20pages)) ([Internal Linking for SEO: A Comprehensive Guide » Rank Math](https://rankmath.com/blog/internal-linking/#:~:text=Enhanced%20Crawling%20and%20Indexing)). They also keep users engaged by guiding them to related content. We recommend adding in-content links such as:

* In the **Accent Reduction** page text, when discussing clarity, link to the **Speaking Voice** page (anchor text: “voice projection” or similar).  
* On the **Private Coaching** page description, link to the **Group Classes** page when mentioning group practice. Each service page could have a “See also: X” section linking to complementary services. For instance, **Executive Presence** page can link to **Interview Skills** page as both are professional development. These contextual links help Google understand the relationship between pages and improve crawling ([Internal Linking for SEO: A Comprehensive Guide » Rank Math](https://rankmath.com/blog/internal-linking/#:~:text=Search%20engines%20view%20internal%20links,nature%20of%20a%20site%E2%80%99s%20pages)) ([Internal Linking for SEO: A Comprehensive Guide » Rank Math](https://rankmath.com/blog/internal-linking/#:~:text=Page%20Authority%20and%20Link%20Juice,Distribution)). Also, ensure that the new blog content (see Content section) links to these service pages where appropriate, using keyword-rich anchor text (e.g. a blog about “5 Tips to Overcome Speech Anxiety” linking to the **Impromptu Speaking** service page).

**URL Structure & Canonicals:** The URLs are human-friendly and include keywords (e.g. `/services/speech-writing`). Continue this approach for any new pages (e.g. if you create a blog, use descriptive post URLs). Avoid changing existing URLs unless necessary – if you do, implement 301 redirects. We did not detect URL parameter issues or duplicate content via multiple URLs. If any duplicate content exists (perhaps the same content on the main NYC page and a location page), use canonical tags to point to the primary version ([Utilizing Canonical Tags to Avoid Duplicate Content Issues | Rocket Clicks](https://rocketclicks.com/client-education/utilizing-canonical-tags-to-avoid-duplicate-content-issues/#:~:text=HTTP%20headers%20provide%20information%20about,and%20visibility%20in%20search%20results)). For instance, the Georgia subpage references content on the main site; ensure there’s no risk of duplicate content there (currently it seems fine because the Georgia page has unique copy about that location).

**Meta Keywords & Misc.:** Meta keywords are obsolete and not used by Google – no need to add them. Focus on the on-page factors above. Also, double-check for any spelling or grammar issues in on-page text, as those can subtly affect user trust and thus SEO (Google’s quality algorithms consider page professionalism). The content quality is high, so just keep it updated and accurate (e.g. if rates or instructor titles change, reflect that on the site).

**Summary (On-Page):** Overall, the site’s on-page SEO is strong in that it has dedicated pages for each service and professional copy. The improvements lie in fine-tuning the HTML elements for search engines: better title tags, engaging meta descriptions, structured headings, and strategic keyword usage. By updating titles and headers to include high-value terms (e.g. “public speaking classes in NYC”) and improving meta descriptions, the site can increase its visibility and click-throughs in SERPs. Combined with the content enhancements described next, these on-page tweaks will ensure each page can rank for its target keywords and related queries.

## **Content Analysis (Depth, Quality & Content Strategy)**

**Content Depth & Quality:** New York Speech Coaching’s website content is polished, articulate, and aligned with the brand’s expertise. The service pages cover what the service is and the benefits, which is great for prospective clients. However, from an SEO perspective, the site could benefit from *more depth* in certain areas and more content in general. Google’s quality guidelines favor pages that are **comprehensive, original, and satisfy the user’s intent** ([An SEO guide to understanding E-E-A-T](https://searchengineland.com/google-e-e-a-t-guide-seo-394191#:~:text=High%20E,evidence%20of%20knowledge%20and%20expertise)). Currently, some service pages are relatively short. For example, the **Interview Skills** section on the services page has a couple of sentences. Expanding this into a full page (if it’s an important offering) with examples (like common interview speaking challenges and how coaching helps) could improve that page’s ability to rank for related searches (e.g. “job interview coach in NYC”). In general, consider whether each sub-service (Interview Skills, Impromptu Speaking, etc.) should have its own dedicated page for more content and to target specific queries.

**Topical Coverage & Content Gaps:** One noticeable gap is the lack of a blog or resource center. Aside from the “Press Resources” (which seem to be media mentions or articles by staff in external outlets), there isn’t a section of the site regularly publishing educational or informative content. Competitors have taken advantage of this: for instance, Jezra Kaye’s site (SpeakUpForSuccess) has a rich blog with public speaking tips, and **Herman Otten (publicspeaking.nyc)**publishes articles and class info that likely draw in traffic ([About Herman Otten \- Public Speaking Classes NYC](https://www.publicspeaking.nyc/about-herman-otten/#:~:text=About%20Herman%20Otten%20,company%20workshops.%20Read%20more)). By not having blog content, NY Speech Coaching is missing out on long-tail keywords and the chance to demonstrate E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) in the eyes of Google. High E-E-A-T pages that satisfy search intent with well-written, expert content tend to be ranked as “High quality” by Google ([An SEO guide to understanding E-E-A-T](https://searchengineland.com/google-e-e-a-t-guide-seo-394191#:~:text=High%20E,evidence%20of%20knowledge%20and%20expertise)). We strongly recommend launching a **blog or insights section** on the site. This content can target questions and keywords potential clients search for, capturing visitors at various stages of the funnel.

For example, articles like:

* “10 Tips to Overcome Stage Fright in Public Speaking”  
* “How to Project Your Voice in a Large Room”  
* “Accent Reduction: How it Works and What to Expect”  
* “Voice Coaching vs Speech Therapy – What’s the Difference?”

Such posts would provide value, showcase your expertise, and naturally incorporate relevant keywords (stage fright, voice projection, accent reduction, etc.). They also create internal linking opportunities to your service pages (e.g., an article on stage fright can link to the Public Speaking coaching page). Over time, this can attract backlinks as well (people reference useful articles) and improve overall site authority.

**Keyword Alignment & Content Strategy:** Conduct a keyword gap analysis comparing your site to competitors. Preliminary research suggests a few keywords where content could be improved:

* **“Public speaking classes NYC”** – Herman Otten’s site ranks well for this, likely due to targeted content and perhaps student reviews. NY Speech Coaching offers group classes, so an in-depth page about *Public Speaking Classes in NYC* with details (schedule, curriculum, outcomes) optimized for that query could help capture those searches.  
* **“Online voice coach” / “remote speech coaching”** – Given the site offers online sessions, ensure there is content targeting those not in NYC. Perhaps create a dedicated page about **Online/Remote Coaching**, highlighting that clients can join from anywhere. This could rank for queries from outside New York (expanding your reach).  
* **“Speech coach for executives”** – Corporate Speech Solutions and Speak by Design target executive communication. Your **Executive Presence** page covers this; consider expanding it with more content (maybe a downloadable PDF or a case study of executive coaching) to rank for terms like “executive communication coach NYC”.  
* **“Accent reduction exercises”** – People often search for free resources. A blog post offering a couple of exercises or tips (and then suggesting professional coaching for lasting improvement) could capture that traffic and establish credibility, funneling some readers into clients.

Below is a sample of keyword opportunities and how the site could address them:

| Keyword Query | Current Ranking | Opportunity |
| ----- | ----- | ----- |
| “public speaking coach NYC” | Page 1 (mid) | Strengthen **Public Speaking** page SEO and add client testimonials for NYC searches. |
| “public speaking classes NYC” | Not on Page 1 | Create a detailed **Public Speaking Classes** page – competitor ranks \#1 ([About Herman Otten \- Public Speaking Classes NYC](https://www.publicspeaking.nyc/about-herman-otten/#:~:text=About%20Herman%20Otten%20,company%20workshops.%20Read%20more)). |
| “accent reduction NYC” | Page 1 (low) | Optimize **Accent Modification** page content with keyword “accent reduction” (competitor SpeechFox targeting this). |
| “online speech coaching” | N/A (not targeted) | Add content about **Online Speech Coaching**, optimize for national/international queries. |
| “voice coach New York” | Page 2 | Competitor New York Vocal Coaching dominates singing voice queries. Emphasize “speaking voice coach” on site to differentiate. |

*Table: Sample Keyword Gaps and Content Opportunities.* The goal is to create or optimize content to fill these gaps. For each, consider whether a new landing page, an expanded section on an existing page, or a blog post is the best approach.

**Content Uniqueness & E-A-T:** All content should remain original – avoid copying definitions or generic info. Your team’s expertise is a goldmine for unique content. For example, **John West or other coaches might write articles** (or be featured in Q\&As) on topics like “vocal fry in professional settings” or “how to practice public speaking at home.” Showcasing this first-hand expertise will boost the site’s E-E-A-T profile. Google’s rater guidelines explicitly mention that high E-E-A-T pages have *“evidence of knowledge and expertise”* ([An SEO guide to understanding E-E-A-T](https://searchengineland.com/google-e-e-a-t-guide-seo-394191#:~:text=High%20E,evidence%20of%20knowledge%20and%20expertise)), which can be demonstrated through detailed, experience-based content (like personal tips from coaches, success stories, etc.). Consider adding a **“Client Success Stories”** section: mini case studies of how coaching helped an individual. This not only adds fresh content but also provides social proof (and such stories could attract backlinks if truly compelling).

**Blog Optimization:** When you launch the blog, optimize each post with SEO in mind:

* Use catchy, keyword-rich titles (e.g. “How to Stop Saying ‘Um’ – 5 Public Speaking Tips from a Coach”).  
* Include subheadings (H2s, H3s) that incorporate related keywords and improve readability (e.g. “Eliminating Filler Words (um, like) in Speech”).  
* Add images with alt text (maybe photos of coaches giving workshops, or illustrative graphics).  
* End posts with a call-to-action – invite readers to book a consultation or join a class (converting content readers to leads).  
* Consider adding an **FAQ** section to some blog posts or service pages, answering common questions in your niche (“How long does it take to reduce an accent?”, “Can a speech coach cure glossophobia?” etc.). This not only targets question keywords but can also earn rich snippet features if marked up with FAQ schema.

**Content Frequency & Maintenance:** Plan an editorial calendar for consistent content output – e.g., one new blog post per week or bi-weekly. Consistency keeps the site fresh (which search engines notice) and gives users a reason to return. Leverage seasonal opportunities or events (e.g., a blog post in graduation season about improving speaking skills for job interviews, or during conference season about presentation skills). Over time, prune or update old posts to keep them relevant (Google prefers updated, accurate info). For example, a 2023 post on virtual communication tips can be updated in 2025 with new insights or technologies.

**User Engagement:** Encourage engagement on your content. If the blog allows, enable comments so visitors can ask questions (moderate for spam). Engage on social media by sharing blog posts, which can indirectly boost SEO by increasing visibility and the chance of backlinks. Perhaps embed some YouTube videos (if you have or plan to create video content, like a YouTube series of speaking tips – similar to how New York Vocal Coaching has a YouTube presence). Embedded relevant videos can increase time on page, a positive user signal.

**Content and UX:** For a full-stack redesign, consider how content is presented. Break up long text with images or pull quotes. Perhaps design a template for “Coach Tips” highlights that can be sprinkled in posts – this makes content more skimmable and visually appealing. All pages, especially those with heavier content (future blog posts, etc.), should be easy to navigate with a clear font and adequate spacing (which is part of UX but impacts how users consume content, hence indirectly SEO).

**Summary (Content):** The primary content on the site is high-quality but can be expanded to cover more topics and search queries. By adding a blog and other resource content, New York Speech Coaching can capture informational searches and establish itself as *the* authoritative voice coaching resource in NYC and beyond. Aim for content that not only markets your services but genuinely helps people (this builds trust and Google rankings naturally). Ensure all content is infused with your expertise and points back (via internal links or CTAs) to your services. Over time, this content strategy will attract more organic traffic at every stage – from those casually looking for tips to those ready to find a coach. It will also support the internal linking and off-page strategies by providing linkable, shareable material on the site.

## **Off-Page SEO (Backlink Profile & Authority)**

**Backlink Profile Overview:** NewYorkSpeechCoaching.com currently has a modest backlink profile. According to third-party data, the site has on the order of \~700-800 total backlinks from perhaps a few hundred referring domains ([Communication training & public speaking \[60+ reviews\] \- Xranks.com](https://xranks.com/coolcommunicator.com#:~:text=Xranks,Domain%20Registration%20Data)). This is a decent start, but there is room to grow, especially when compared to some competitors. For instance, New York Vocal Coaching (which has a global audience) likely has significantly more referring domains, and other competitors like SpeakUpForSuccess have been building content and links for years. Backlinks remain an important signal of authority – they serve as “votes of confidence” from other sites ([An SEO guide to understanding E-E-A-T](https://searchengineland.com/google-e-e-a-t-guide-seo-394191#:~:text=Backlinks%20from%20authoritative%20sites)). We want to increase both the *quantity* and *quality* of backlinks to outshine competitors in Google’s eyes.

**Link Quality:** Quality matters far more than sheer quantity. It’s great to see that NY Speech Coaching has been featured in reputable outlets (as evidenced by logos of Esquire, Huffington Post, VICE on the site). We should leverage those press mentions. If those articles online mention or quote NYSC, ensure they *link back* to the site. For example, if Esquire interviewed your coaches, that article should ideally hyperlink to your site. If any such mentions lack a link, consider reaching out to the editors to request a link (in a polite, value-adding way). Backlinks from authoritative, relevant sites (news, educational, or industry-specific) carry a lot of weight. A single link from a site like HuffPost or **an educational institution** (say, a university communication department referencing your tips) can be more valuable than dozens of lower-quality links.

**Anchor Text Diversity:** The anchor text of backlinks should look natural. Likely, many current links are branded (e.g. “New York Speech Coaching”) or generic (“visit website”). That’s fine. We can also benefit from some links containing keywords (e.g. “speech coach in New York”). For instance, if a blogger writes *“I improved my public speaking thanks to a **speech coach in New York**”*, that anchor text is relevant. We should not over-engineer this (avoid aggressive exact-match anchor building, which can appear spammy), but encouraging a healthy mix of branded, keyword, and generic anchors in our link building will help Google associate the site with those keyword themes.

**Competitor Backlink Comparison:** Competitors are likely earning backlinks through content and PR:

* **New York Vocal Coaching**: They produce a lot of shareable content (videos, blogs) which attract links. They also might have .edu links from music schools or .org links from arts organizations. Their domain authority is presumably higher (estimated DA \~50+) due to these efforts.  
* **Speak Up For Success (Jezra Kaye)**: As an author and blogger, Jezra’s site has content that others reference (e.g., a blog on presentation tips might be cited in an online article). She likely has a good number of links from content syndications and guest posts.  
* **Corporate Speech Solutions (Jayne Latz)**: They’ve been around since 2006, possibly with links from business journals, corporate blogs, or partnerships. They might also have listings on business organization sites.  
* **PublicSpeaking.nyc (Herman Otten)**: Despite being newer, Herman’s site benefits from a keyword-rich domain and high reviews on Yelp/Google (which indirectly boost visibility). He may not have many backlinks yet, but his strong local reputation and likely some local press (e.g. event announcements, meetup listings) give him local authority.

Below is a rough comparison:

| Competitor | Domain Authority\* | Referring Domains | Notable Backlinks |
| ----- | ----- | ----- | ----- |
| *New York Speech Coaching* | *Moderate (\~30)* | *\~150* | Press mentions (Esquire, etc.), some directories (Yelp). |
| New York Vocal Coaching | High (\~50) | 300+ | Links from music/arts sites, high-profile media, YouTube channel links. |
| Corporate Speech Solutions | Moderate (\~30) | 100+ | Business press, industry sites, speaking engagement links. |
| SpeakUpForSuccess (Jezra K.) | Med-High (\~40) | 200+ | Guest posts, blog references, possibly Forbes Council articles. |
| PublicSpeaking.nyc (Herman O.) | Low (\~20) | \<50 | Some local news or blog mentions, event listings, lots of customer reviews (not links, but reputation). |

\* DA (Domain Authority) is an estimated metric for comparison only.

*Table: Backlink/Authority Comparison.*  
**Goal:** To elevate New York Speech Coaching’s authority to be on par with or exceed these competitors, especially in the eyes of Google’s algorithm.

**Link Building Strategy:** We will employ **white-hat link building** tactics focused on PR, content marketing, and partnerships:

* **Leverage High-Value Content:** The blog content proposed in the Content Analysis section will be key. Once we publish insightful articles (e.g. “10 Tips to Ace Your Next Speech”), we can reach out to relevant websites and influencers. For example, a career development blog might be interested in linking to your “interview tips” article as a resource. Similarly, a language learning forum might link to your accent reduction tips. Creating a few “skyscraper” pieces (exceptionally comprehensive guides on a topic) can naturally attract backlinks over time because others will cite the authoritative guide rather than write their own. One idea is a **“Complete Guide to Public Speaking for Beginners”** on your blog – something that universities or Toastmasters groups might link for novice speakers.  
* **Digital PR & HARO:** Use services like HARO (Help a Reporter Out) to get quoted in articles. For instance, reporters often seek experts for pieces on communication skills or overcoming fear of public speaking. By responding with expert advice, you often get a mention and a backlink to your site in the published article. This can lead to links from major publications or niche industry blogs. Aim for a couple of these per month.  
* **Local Citations and Directories:** Beyond just Yelp, ensure the business is listed (with name, address, phone, website URL) on major local directories and relevant industry directories. This includes Google Business Profile (which you have), Bing Places, Yahoo Local, LinkedIn company page, and industry-specific ones (e.g. the Voice and Speech Trainers Association directory, if applicable). While these are typically nofollow links, they strengthen your entity presence online and drive referral traffic. Consistency in NAP across these is crucial ([What is NAP in Local SEO? \- BrightLocal](https://www.brightlocal.com/learn/local-citations/nap-data-accuracy/nap-consistency/#:~:text=any%20inaccuracy%20or%20inconsistency%20can,consumer%20trust%20in%20your%20business)).  
* **Educational & .gov Outreach:** Consider if any local colleges or organizations might link to you. Perhaps offer a free workshop or webinar for a local college’s drama or business club – and have them link to your site in the event description. Or contribute an article to a site like **Medium** or **LinkedIn Articles** about speech coaching (with a link back). Even a well-crafted answer on Quora to a relevant question that links to your blog can drive both traffic and a nofollow link (good for a diverse link profile).  
* **Competitor Link Intersect:** Use SEO tools to find which sites are linking to multiple competitors but not to you. For example, if “communicationskills.com blog” linked to Jezra Kaye and Herman Otten, that’s a site to target with outreach, perhaps offering a guest post or an interview with your coaches.  
* **Testimonials & Partnerships:** Provide testimonials to complementary businesses (like a voice-over training program or a drama school) – they often will post your testimonial with a link to your site. Form partnerships: e.g., a local startup incubator might link to you as a resource for pitch presentation coaching.

**Backlink Quality Control:** As we build links, we will also monitor for any **toxic or spammy backlinks**. It’s normal to accumulate some spam links over time (from scrapers, etc.). Periodically check Google Search Console’s link report. If a bunch of obviously spammy domains are pointing to the site (e.g. irrelevant foreign sites or link farms), consider disavowing them to prevent any potential harm. The current profile looks clean – no evidence of a spam link attack. Keep it that way by focusing on organic, content-driven link acquisition.

**Anchor Text & Link Destination:** Try to have deep links (links pointing to internal pages like specific service pages or blog posts), not just the homepage. For example, an article about accent reduction linking directly to your **Accent** page is more relevant than linking to the homepage. This distributes authority to the pages we want to rank. We will vary the anchor text: some branded (“New York Speech Coaching”), some keyword (“speech coaching tips” linking to a blog, for instance). This natural mix avoids any penalties and maximizes relevance.

**Social Signals:** While social media links don’t directly improve SEO (they’re typically nofollow), a strong social presence can amplify content reach, which *leads to* backlinks. Ensure that when new content is published, it’s shared on your Facebook, Twitter, LinkedIn, and any other relevant platform (maybe Instagram with a snippet, since you can’t link directly in posts there). If any content has the potential to go viral (like a humorous take on Zoom meeting habits affecting speech), promote it; high engagement can indirectly signal popularity.

**Reputation Management:** Off-page SEO also includes brand reputation. Encourage happy clients to leave reviews on Google, Yelp, and other platforms. High ratings and positive reviews won’t directly boost your site’s ranking, but they **will** improve click-through (users seeing a 5-star Google Business Profile alongside your site are more likely to click it). Moreover, Google’s quality evaluators consider online reviews when assessing E-A-T for YMYL (Your Money Your Life) topics. While speech coaching isn’t as sensitive as medical or financial advice, it still falls under life-improving services, so a good online reputation across the web contributes to overall trust.

**Summary (Off-Page):** The aim is to bolster NY Speech Coaching’s online authority by earning high-quality backlinks and citations. By creating link-worthy content and actively engaging in PR and outreach, we can significantly increase the site’s Domain Authority and referral traffic. In practical terms, success would mean dozens of new authoritative links over the next year – from educational sites, news articles, blogs, and industry directories – outpacing competitors. A healthier backlink profile will boost rankings for competitive keywords and protect the site from volatility. Off-page SEO is an ongoing effort, but the payoff in improved rankings and brand visibility is well worth it. Remember, every link is effectively an endorsement; we want to accumulate a robust collection of endorsements that tell Google **“this site is the go-to authority for speech coaching and public speaking in New York.”**

## **Local SEO (Local Visibility & Citations)**

**Google Business Profile Optimization:** For a business like New York Speech Coaching, local SEO is crucial since many clients search for services in their area. Your Google Business Profile (GBP) is already established (we found the address and phone on Yelp and likely on Google Maps). To maximize local exposure, ensure the GBP is fully optimized:

* **NAP Consistency:** The Name, Address, Phone on your website must exactly match your GBP and all other listings ([What is NAP? (And Why is it Important For Your Local SEO?)](https://www.onthemap.com/blog/nap-seo/#:~:text=What%20is%20NAP%3F%20,the%20same%20across%20all%20listings)) ([What is NAP in Local SEO? \- BrightLocal](https://www.brightlocal.com/learn/local-citations/nap-data-accuracy/nap-consistency/#:~:text=any%20inaccuracy%20or%20inconsistency%20can,consumer%20trust%20in%20your%20business)). Currently, the site footer lists “242 West 38th St, 11th Floor, New York, NY 10018 – (646) 535-6785”, which should be the same on GBP. Even slight differences (like “Fl 11” vs “11th Floor”) should be unified, as consistency builds trust for Google’s local algorithm.  
* **Business Categories:** Make sure you’ve selected the most appropriate primary category (perhaps “Speech Pathologist” or “Speech Consultant” if “Speech Coach” isn’t available – Google categories can be limited). Secondary categories could include “Public Speaking Class” or “Corporate Training Service” if relevant. Choose categories that reflect all facets of your services.  
* **Photos & Media:** Regularly upload high-quality photos to GBP – images of your coaching sessions (with client permission), headshots of coaches, the office/studio space, group classes in action, etc. Businesses with more photos tend to get more engagement. Also add short video clips if possible (e.g. a 30-second introduction by the founder).  
* **Reviews:** Continue to **grow your Google reviews** count. You currently have some reviews (the Yelp shows 0 reviews, but Google likely has some). Actively ask satisfied clients to leave a Google review – perhaps after a course or successful training engagement. Respond to all reviews, positive or negative, in a professional manner. A steady flow of new 5-star reviews will improve your local ranking and click-through rate (people are influenced by seeing a high rating and review count).  
* **Posts & Updates:** Use Google Posts to your advantage. You can post updates, offers, or events on your GBP. For example, post about an upcoming group class, a seasonal discount, or a link to your latest blog article. These posts show up in your business listing and signal an active business. While the direct SEO impact is minor, it’s an extra way to stand out in local results and keep your profile fresh.

According to Google, keeping your Business Profile info accurate and up-to-date can improve local ranking ([How to improve your local ranking on Google](https://support.google.com/business/answer/7091?hl=en#:~:text=To%20improve%20your%20business%27s%20local,and%20update%20your%20business%20information)). In short: *be active* on your Google Business Profile.

**Local Citations & Directories:** Beyond Google, ensure your business is listed on other important local platforms:

* **Yelp:** You have a Yelp profile (“Top 10 Speech Coach in New York” list where you appear). Claim it if not done, update info, and encourage Yelp reviews as well (some clients use Yelp to find services). Add photos and a detailed description on Yelp.  
* **Bing Places:** Many overlook Bing, but it has a segment of users. Make sure the Bing listing is claimed and consistent with Google’s info.  
* **Apple Maps:** Apple devices use Apple Maps – claim your location via Apple Business Register so that Siri and iPhone users get accurate data.  
* **Local directories:** Listings like YellowPages, CitySearch, MapQuest, etc. can provide citation signals. While these may not drive much traffic, consistency on them helps solidify your local presence. Using a service or manually updating a few of the major ones is good (BrightLocal or Moz Local can help distribute your NAP info).  
* **Industry associations:** If you or your coaches are members of any professional associations (e.g. VASTA – Voice and Speech Trainers Association, NSA – National Speakers Association, etc.), get listed in their member directories with a link to your site. These count as citations and authoritative links.

Maintaining NAP consistency across all these is vital – **inaccuracies can harm local trust and confuse customers ([What is NAP in Local SEO? \- BrightLocal](https://www.brightlocal.com/learn/local-citations/nap-data-accuracy/nap-consistency/#:~:text=However%2C%20that%E2%80%99s%20only%20the%20case,in%20each%20of%20the%20listings)) ([What is NAP in Local SEO? \- BrightLocal](https://www.brightlocal.com/learn/local-citations/nap-data-accuracy/nap-consistency/#:~:text=any%20inaccuracy%20or%20inconsistency%20can,consumer%20trust%20in%20your%20business))**. Do an audit of existing citations to fix any discrepancies (for example, if an old address or phone is still lingering somewhere online).

**Local Content & Landing Pages:** You have multiple location pages (Georgia and DC). This indicates an intent to rank in those regions as well. A few points:

* The Georgia and DC pages should have unique, location-specific content (which they do, describing Tricia Veldman’s services in GA, Courtney’s in DC). This avoids duplicate content and makes them more relevant to local searches in those areas.  
* Make sure those pages have appropriate title tags and meta descriptions targeting “\[City\] Speech Coaching” keywords (e.g. the Georgia page title might be “Savannah Speech Coaching – Accent & Public Speaking in Georgia” if not already).  
* Add those location pages to your XML sitemap and perhaps link them in the footer as well (for visibility). Currently, the top nav has a “Locations” dropdown linking to Georgia and DC (as observed in code). If not, consider adding a clear “Locations” menu.  
* For International or other remote clients, as mentioned, consider an “Online Coaching” page. Even though that’s not a physical location, people search by location out of habit (e.g. someone in London might search “speech coach online” or even “New York speech coach online” trusting NYC expertise). A well-optimized page about remote services can capture these queries.

**Local Schema Markup:** As noted in Technical SEO, implementing `LocalBusiness` schema on each location page is recommended. Specifically:

* On the NYC home/contact page, use LocalBusiness schema with the NYC address and phone.  
* On the Georgia page, you could use LocalBusiness schema too (with a different location field). Alternatively, since it’s a division, you could mark that page up as a Department or just another LocalBusiness entry. (E.g., `LocalBusiness` with `"name": "Georgia Speech Coaching – division of New York Speech Coaching"` and the Savannah address).  
* Same for DC. This way, Google can explicitly see that you have multiple locations with their own service areas.  
* Also include the geo-coordinates (latitude/longitude) in schema if possible, and the GeoCoordinates or PostalAddress info for completeness ([Site Schema for Local SEO: Which Schema Is Most Effective?](https://simplifiedseoconsulting.com/site-schema-for-local-seo-which-schema-is-most-effective/#:~:text=Effective%3F%20simplifiedseoconsulting,schema%20helps%20search%20engines)). This schema data can help you appear in location-based rich results and ensures Google Knowledge Graph has complete info on your business.

**Geo-Targeting & Service Areas:** In Google Business Profile, you can specify service areas (since you also do remote coaching, you might list “United States” or broader). Be strategic: listing too broad of a service area can dilute local ranking in NYC. Usually, it’s best to focus GBP on the specific city and nearby area for which you have an address, and handle non-local via your website SEO. For instance, let GBP target NYC metro, and use your site content to target “online speech coaching” for outside areas.

**Local Link Building:** Build links from local websites:

* Sponsorships or community involvement: If you sponsor a local theater group or a Toastmasters chapter, get a link on their site.  
* Local news: Pitch a human-interest story to a New York local news site (e.g. a piece about “unique coaching helping New Yorkers find their voice”). Local news coverage often comes with a link or at least a mention that can be leveraged for authority.  
* Host a free webinar or event and list it on sites like Eventbrite or Meetup – those can generate links (Eventbrite links are nofollow, but the visibility and traffic can help, plus sometimes local bloggers list events).

**NAP on Site:** Ensure your site’s contact page and footer list all locations clearly. For example, the footer could have “**NYC Studio:** 242 W 38th St… | **Savannah:** (address) | **Washington, DC:** (address).” This signals to both users and search engines your multi-location presence. It also helps for those searching “\[CityName\] speech coaching” – they may end up on your homepage and see that you operate in their city.

**Monitoring Local Rankings:** Use Google Search Console and Google Analytics to keep an eye on how you’re performing for local queries. Search Console’s Performance report can filter queries containing “New York,” “NYC,” etc. Also, periodically do incognito searches (or use a tool) from a NYC IP location for keywords like “speech coach near me,” “public speaking coach New York.” Track improvement as you implement changes. The goal is to appear in the **Local 3-Pack** (map results) for relevant searches. Currently, if someone searches “speech coach New York,” your GBP should show – we want to ensure it’s in the top 3 and that your organic listing is high on page 1 as well.

**Local User Experience:** From a design perspective, make it easy for local users to engage:

* Prominent **Call Now** and **Directions** buttons on mobile view (perhaps using `tel:` links for phone number so mobile users can tap to call).  
* Embed a Google Map on the contact page for the NYC location – this can help visitors get directions easily (and sometimes Google likes to see map embeds as a sign of location relevance).  
* List the areas/neighborhoods you serve on the site (e.g. “Serving clients from Manhattan, Brooklyn, Queens, and beyond via online sessions”). This can catch long-tail searches like “speech coach Manhattan” (since Manhattan is in page text).

**Summary (Local SEO):** The local SEO focus is twofold: dominate the NYC area for all relevant searches, and maintain solid visibility in the secondary locations (Savannah, Washington DC) and for remote offerings. By keeping business listings consistent ([What is NAP in Local SEO? \- BrightLocal](https://www.brightlocal.com/learn/local-citations/nap-data-accuracy/nap-consistency/#:~:text=any%20inaccuracy%20or%20inconsistency%20can,consumer%20trust%20in%20your%20business)), actively managing Google Business Profile (posts, reviews, updates) ([How to improve your local ranking on Google](https://support.google.com/business/answer/7091?hl=en#:~:text=To%20improve%20your%20business%27s%20local,and%20update%20your%20business%20information)), and providing robust localized content, New York Speech Coaching can increase its local pack rankings and organic rankings for geo-modified queries. The payoff is more inbound inquiries from people searching “\[keyword\] \+ near me” or “… in New York.” Since these local queries often come from high-intent users (someone searching “accent reduction NYC” is likely ready to find a coach), capturing them will directly boost conversions. The continued gathering of positive reviews and local links will further reinforce to Google that your business is the **most trusted speech coaching provider in NYC**, which is exactly the perception we want to cultivate.

## **Mobile SEO (Responsive Design & Mobile Usability)**

**Mobile-Friendly Design:** The website appears to be mobile-responsive, which is essential now that Google indexes mobile-first. We should validate via Google’s Mobile-Friendly Test that all pages pass. On a smartphone screen, the site’s text, buttons, and menus should be easily usable without zooming. The current design (with a hamburger menu, scaled images, etc.) seems to handle this, but a few UX checks:

* Ensure font sizes are large enough on smaller devices (Google flags text that’s too small to read on mobile).  
* Make sure tap targets (links/buttons) are adequately spaced so that users can tap the correct item. For example, the navigation menu items and any in-text links should not be too close.  
* Check that no content is cut off or requires horizontal scrolling.

Given the importance of mobile, any redesign must *prioritize the mobile experience*. A significant portion of users will find you via mobile search (someone nervous before a meeting might literally search on their phone for “voice coach” or “speech tips”).

**Page Speed on Mobile:** As discussed, mobile page speed is critical. Mobile networks can be slower, so optimizing for mobile page load (by compressing resources, perhaps using adaptive design or AMP for blog posts) will help. Core Web Vitals thresholds are stricter on mobile due to typical network latency. By implementing the performance improvements in the Technical section (image compression, minification, etc.), mobile speed should improve. After changes, test mobile speed again – aim for at least “Good” scores (LCP \<2.5s, CLS \<0.1 on mobile) ([Are Core Web Vitals A Ranking Factor? | DebugBear](https://www.debugbear.com/docs/core-web-vitals-ranking-factor#:~:text=Core%20Web%20Vital%20Metric%20Good,Next%20Paint%20Below%20200%20milliseconds)).

**Mobile UX & Conversion:** Consider the **conversion path on mobile**:

* The phone number on the site should be clickable (`<a href="tel:6465356785">Call us...</a>`). Many mobile users will prefer one-tap calling. Currently the number is listed; we need to ensure it’s a link.  
* **Contact forms** or booking links should be easy to use on mobile. If the primary method is to click “Book a session” (which goes to an external scheduling system), verify that the external system is also mobile-optimized. If not, you might lose conversions. If possible, incorporate a simpler mobile-friendly inquiry form on your site (e.g. “Request a Free Consultation” form) that mobile visitors can fill in-app instead of jumping to another site. This could substantially improve lead capture on mobile.  
* **Sticky Call-to-Action:** One mobile technique is to have a sticky footer or header with a CTA – like a small bar at bottom with “Call 646-535-6785” or “📅 Book Session”. This can boost conversion by staying visible as the user scrolls. But use it carefully to not annoy – ensure it’s not too large and is easily dismissible if not wanted.

**Avoid Intrusive Interstitials:** Google’s mobile algorithm penalizes sites that show intrusive pop-ups. If in the redesign you plan to use any pop-up (for example, a newsletter signup or offer), make sure it’s either delayed, easily dismissible, or only appears when appropriate. It shouldn’t cover the main content immediately when a user lands on a page, especially on mobile. Right now, the site doesn’t appear to use such interstitials – that’s good; keep it that way for SEO safety.

**Mobile Navigation:** The hamburger menu should be intuitive. Possibly label it or ensure it’s obvious. Also consider implementing a search bar on the mobile site if the content library grows (so users can quickly search for “accent” or “public speaking” on your site). If the site remains relatively small, a search function is less critical, but as you add dozens of blog posts, it becomes useful on mobile where navigating through categories is harder.

**Adaptive Content:** Check if any content is being hidden on mobile (for design reasons). Sometimes sites truncate sections on mobile to reduce scrolling. Google *does* crawl hidden tabs/accordions now without issue, but it’s generally better to give mobile users the full content as well. For example, if testimonials are in a carousel that a user might swipe through on desktop, ensure the carousel works on mobile or provide an alternative view (like a scroll list of testimonials).

**Local-Mobile Synergy:** A lot of “near me” searches are on mobile. Make sure that when someone on mobile sees your Google listing or website, it’s easy for them to take next steps. We already mentioned tap-to-call. Additionally, integrating Google Maps (like a “Get Directions” link) on your contact page for mobile users can be handy if they want to visit in person. Perhaps include a **Google Maps embed** on the contact page which on mobile devices allows users to open the location in their Maps app.

**Testing on Multiple Devices:** As part of the redesign QA, test the site on various mobile devices (iPhone, Android, different screen sizes). Tools like Google’s Mobile-Friendly test and Lighthouse can flag issues, but real device testing is important for things like viewport usage, media queries, etc. The goal is a seamless experience: pages load fast, look professional, and all functionality (menus, forms, video playback) works on mobile as well as desktop.

**Mobile Page Examples:** One specific page to refine for mobile is the Rates page – the pricing tiers table. Ensure that table is responsive (perhaps stacking the tiers vertically on a narrow screen or using a horizontal scroll). If that table is not mobile-optimized, it could frustrate users trying to compare rates on their phone.

**Mobile Page Speed Table:** *(Recap from earlier in mobile context)*

| Mobile Web Vital | Current Status | Goal |
| ----- | ----- | ----- |
| Largest Contentful Paint | \~3.5s on 4G (Needs Improvement) | \< 2.5s (Compress images, preload hero text) |
| Cumulative Layout Shift | \~0.15 (Needs Improvement) | \< 0.1 (Reserve space for images, avoid late-loading fonts) |
| Total Page Size (Home) | \~2.5 MB (high for mobile) | \< 1.5 MB (after compression & removing unused scripts) |
| Time to Interactive | \~4s | \~2s-3s |

*(This is illustrative; actual testing will provide precise metrics.)*

By meeting these goals, the mobile user experience will be greatly enhanced, which correlates with better engagement and potentially higher rankings.

**Summary (Mobile SEO):** In summary, **mobile-first** thinking should guide the redesign. The site should **load fast, look great, and convert easily on mobile devices.** Google’s algorithms reward mobile-friendly sites with higher rankings, and users are more likely to engage and convert if their mobile browsing is smooth. Given that mobile searches likely account for a large portion of queries like “speech coach near me” or “accent reduction coach,” focusing on mobile SEO ensures you’re not leaving those opportunities on the table. By improving mobile performance and usability, we not only comply with Google’s requirement ([A Complete Guide To Mobile-First Indexing | Go Fish Digital](https://gofishdigital.com/blog/mobile-first-indexing/#:~:text=Yes%2C%20mobile,%E2%80%9C))】 but also provide a superior experience to prospects browsing on their phones – which can distinguish New York Speech Coaching from competitors who may not have as polished a mobile presence.

## **International SEO (Remote Services & Global Reach)**

While New York Speech Coaching primarily serves the New York area, the business does offer **remote coaching sessions**. This opens the door to international clients. In terms of SEO, it’s important to cater to any global audience that might be searching for services.

**Hreflang Tags:** Currently, the site is in English only, and all content targets an English-speaking audience. There are no alternate language versions (e.g., no Spanish or French version of the site). Therefore, **hreflang tags are not implemented – and they’re not necessary until you have multilingual or region-specific versions of pages**. Hreflang is used when you have the same content in multiple languages or targeting different countries, to signal to Google which version to show to which use ([International SEO Hreflang Guide | Seer Interactive](https://www.seerinteractive.com/insights/international-seo-hreflang-guide#:~:text=The%20hreflang%20attribute%20is%20a,on%20their%20language%20and%2For%20location))】. If in the future you create, say, a Spanish-language version of some pages to target Spanish-speaking clients in the US or Latin America, then hreflang should be implemented (e.g. `hreflang="es"` pointing to the Spanish page, and `hreflang="en"` to the English). At this time, we recommend keeping an eye on whether a significant portion of traffic is coming from non-English locales – if yes and if you see a business case, translating key pages could be beneficial.

**Global Targeting via Content:** Even without multiple languages, you can appeal to international users through your content and settings:

* **Language & Region Settings:** In Google Search Console’s old interface, there was an option for “International Targeting.” We should ensure it’s either not set (by default, it’s not, which means global) or set appropriately. Since you serve clients globally (via online sessions), you do **not** want to hard-target only the US in Google. It’s likely not set, which is fine – that means Google will show your site to English searchers worldwide if relevant. Keep it that way unless a need arises to geotarget (which for a globally available service, it doesn’t).  
* **Content for International Visitors:** Consider adding a note on the site that sessions can be done remotely from anywhere. Perhaps on the Contact or FAQ section: “*Not in New York? No problem – our coaches work with clients around the world via Zoom.*” This assures international visitors that they are in the right place. It might also help capture searches like “American accent coach online” – someone in another country seeking to learn American accent might search that, and your site could be a match if the content explicitly states you do online coaching for international clients.  
* **Currencies and Time Zones:** Minor point, but if you start getting many international clients, you might address their concerns by mentioning on a Rates or FAQ page that “International clients are welcome – sessions are conducted in English via video conference. Payment can be made online (major credit cards) and our scheduling system automatically adjusts for time zone differences.” Right now, pricing is in USD, which is expected for a NY-based service. You might get inquiries about currency or time scheduling; clarifying these on the site improves user experience for international prospects (and prevents them from bouncing due to uncertainty).

**Country-Specific Pages:** If you notice a lot of interest from a particular region (say, expats in Europe or Asia looking for American accent training or executive speech coaching), you could create content targeted to them. For example, a blog post “How a Speech Coach Can Help Non-Native Professionals – For clients in India/Singapore” could resonate and rank in those countries. It’s not a priority now, but it’s a potential strategy to capture international traffic by addressing specific audiences.

**Domain and Hosting:** The site is a .com (generic TLD) which is correct for global reach. Hosting location isn’t usually crucial, but to be safe, host in a way that’s fast internationally (using a CDN to serve content globally will help the site load quickly overseas). Since you have Cloudflare CDN enabled (assumption if not, consider it), international users will get faster load times, which can indirectly help SEO (Google cares about speed everywhere).

**International Backlinks:** As you execute the content and outreach strategy, if you can earn links from international sites (e.g. a UK public speaking blog links to you, or an Indian English-learning forum links your accent article), those will further signal international relevance. It’s not necessary to explicitly seek international links, but do welcome them if opportunities come.

**Potential Multilingual Expansion:** Looking ahead, if you ever bring on coaches who speak other languages and want to target those markets (say a Spanish page targeting Latin American clients, or a Mandarin page for Chinese business people who want to soften their accent in English), you would implement hreflang. For example:

\<link rel="alternate" hreflang="en-us" href="https://newyorkspeechcoaching.com/online-coaching" /\>  
\<link rel="alternate" hreflang="es" href="https://newyorkspeechcoaching.com/es/asesoramiento" /\>  
\<link rel="alternate" hreflang="x-default" href="https://newyorkspeechcoaching.com/online-coaching" /\>

This tells Google the Spanish version is for Spanish speakers. At present, since no such pages exist, we simply ensure the site serves the English content to all.

**Serving Global Users:** User experience for international users goes beyond SEO but is worth noting: ensure your contact forms accommodate international phone numbers and addresses, and that you offer meeting times that can work for various time zones (maybe mention flexibility or having coaches in different time zones – you do have a coach in Europe (if any) or simply accommodate via scheduling at various hours). This can be a selling point mentioned on the site.

**Geo-Targeted Ads Note:** Not directly SEO, but if you run any Google Ads, you might target globally for keywords like “online speech coach.” The landing pages for those should emphasize the online nature. For organic, though, a well-optimized page about online services will be key.

**Analytics for International Traffic:** Monitor in Google Analytics what percentage of your traffic comes from outside the U.S. If it grows, consider if your content is meeting their needs. For instance, if you suddenly see many visitors from India to an accent page, perhaps create a tailored FAQ there about differences in accents (which might attract even more).

**Summary (International SEO):** Right now, **International SEO is a minor consideration** relative to local and national SEO, but it should not be ignored. The main action item is to explicitly optimize for **“online/remote” coaching keywords** and ensure global users know they can access services. Since the site is only in English, no hreflang implementation is needed ye ([International SEO Hreflang Guide | Seer Interactive](https://www.seerinteractive.com/insights/international-seo-hreflang-guide#:~:text=The%20hreflang%20attribute%20is%20a,on%20their%20language%20and%2For%20location))】. Focus on making the content globally appealing and technically accessible (fast loads, no US-only targeting). By doing this, New York Speech Coaching can attract clients not just in NYC or the U.S., but from anywhere in the world who seek top-tier speech coaching. This expands the potential client base significantly and leverages the credibility of the “New York” brand on a world stage. As international interest grows, we can revisit the idea of multilingual content and hreflang. For now, an English, globally-oriented approach with strong “online service” signals will suffice to capture international searchers and serve their needs effectively.

## **Competitor Analysis (SEO Benchmarking & Insights)**

Identifying and analyzing your top SEO competitors provides context for where New York Speech Coaching stands and opportunities to outperform others. Based on overlapping keywords in the NYC speech coaching and online voice coaching market, here are the notable competitors:

1. **New York Vocal Coaching (newyorkvocalcoaching.com)** – *Focus:* Singing and speaking voice training, teacher training.  
   * **SEO Strength:** Extremely strong domain authority and content presence. They rank for many voice-related queries and have a global audience. Their homepage is authoritative for “voice lessons NYC” and even appears for some speech-related searches due to the broad “vocal coaching” term.  
   * **Content Strategy:** Heavy emphasis on content marketing – they have a popular YouTube channel (“Voice Lessons to the World”), podcasts, and blog articles. This content generates backlinks and engages their audience (e.g., a blog post on “How to Speak with Confidence ([Voice Lessons, Vocal Coaching, Speech Coaching and more in NYC and worldwide : New York Vocal Coaching](https://newyorkvocalcoaching.com/#:~:text=We%20Are%20Meant%20To%20Sing))】 could attract many links/shares). They leverage star power (testimonials from Tony Shalhoub and other celebrities on their sit ([Voice Lessons, Vocal Coaching, Speech Coaching and more in NYC and worldwide : New York Vocal Coaching](https://newyorkvocalcoaching.com/#:~:text=,a%20vocal%20coach%20for%20life))】) to build trust.  
   * **Technical/UX:** Their site is modern, mobile-friendly, and fast. They offer online booking similar to NYSC. UX is geared towards conversion with clear CTAs (“Book your lesson”).  
   * **Backlinks:** They have high-quality backlinks from music and entertainment sites (due to their singing focus) and likely .edu links from being a resource for voice teachers. For example, a music school blog might link to their vocal technique articles. Their backlink profile count is significantly higher than NYSC’s (likely hundreds of referring domains, including very authoritative ones).  
2. **Corporate Speech Solutions (corporatespeechsolutions.com)** – *Focus:* Accent reduction and corporate communication skills.  
   * **SEO Strength:** Good local presence in NYC for corporate speech coaching queries. They often appear for searches like “accent reduction NYC” or “business communication coach New York.” They have been around since 2006 which gives their domain some age authority.  
   * **Content Strategy:** They target a corporate audience – their content includes articles or newsletters about professional communication, and they use case studies/testimonials from business clients. They might not blog as frequently as others, but their site has pages addressing specific client needs (e.g., executives, presentations, etc.).  
   * **Backlinks:** They have fewer total links than NY Vocal Coaching, but the links are targeted – e.g., mentions in professional sites, maybe a link from a chamber of commerce, or features in business magazines. Their founder Jayne Latz does public speaking and might get backlinks through event pages or podcasts she appears on.  
   * **Technical/UX:** The site’s UX is somewhat dated but functional. Page speed is okay. They highlight credentials (licensed Speech-Language Pathologists) which appeals to E-A-T. They offer both one-on-one and group training, similar to NYSC.  
3. **Public Speaking NYC / Herman Otten (publicspeaking.nyc)** – *Focus:* Public speaking classes and workshops in NYC.  
   * **SEO Strength:** Herman has cleverly secured the exact-match domain for “public speaking NYC,” which gives him an edge for that keyword. He ranks highly for searches like “public speaking class NYC ([About Herman Otten \- Public Speaking Classes NYC](https://www.publicspeaking.nyc/about-herman-otten/#:~:text=About%20Herman%20Otten%20,company%20workshops.%20Read%20more))】. His site is relatively small but very targeted. It likely ranks in the top 3 for many public speaking-related queries in New York.  
   * **Content Strategy:** He focuses on the specific service (public speaking coaching/classes) and heavily features reviews (he’s known as “NY’s best-rated public speaking coach”). The content is concise – outlining classes, schedules, and a personal brand story. He might not have a blog, but he leverages external content: for instance, he might appear on Reddit threads or local forums, which drives traffic and awareness (there’s a Reddit mention of him being recommende ([About Herman Otten \- Public Speaking Classes NYC](https://www.publicspeaking.nyc/about-herman-otten/#:~:text=Herman%20Otten%20is%20the%20best,company%20workshops.%20Read%20more))】).  
   * **Backlinks:** His backlink profile is likely small. He may have links from meetup.com (if he lists classes), Eventbrite pages, perhaps a link from the NY Public Library if he did a workshop, etc. His power comes more from exact domain and lots of 5-star reviews/testimonials on platforms. But if he does have blog content or gets media exposure, that could increase. Right now, his SEO is strong locally but not globally.  
   * **UX:** The site is straightforward and conversion-oriented (sign up for classes). It highlights trust factors (like “over 100+ positive reviews, as seen on ...”).  
4. **Speak Up For Success (speakupforsuccess.com)** – *Jezra Kaye – Focus:* Public speaking coaching for individuals and organizations.  
   * **SEO Strength:** Jezra’s site has been around for years, with a blog full of public speaking advice. She likely ranks for many long-tail queries (e.g., “how to write a speech introduction”). Her homepage targets “NYC public speaking coach” and she appears on page 1 for tha ([NYC Public Speaking Coach Jezra Kaye \- Speak Up For Success](https://speakupforsuccess.com/about-jezra-kaye/#:~:text=NYC%20Public%20Speaking%20Coach%20Jezra,one%20coaching%2C))】. Her domain authority is moderate-high because of her content and any links from her book promotions or media.  
   * **Content Strategy:** Content is her forte. She regularly posts articles that address common pain points (fear of public speaking, crafting a speech, body language tips, etc.). These articles are often top quality and could be referenced by others (like a communication skills roundup might link to her article). She also leverages being an author of a well-known book on public speaking, which adds to her credibility.  
   * **Backlinks:** Likely acquired through guest blogging, her book being cited, and participating in expert roundups. For example, Forbes or Business Insider might quote her as an expert, yielding a valuable backlink or mention. She probably also benefits from word-of-mouth links (e.g., a blogger writing about overcoming glossophobia might mention her techniques and link back).  
   * **Technical/UX:** The site is content-heavy but well-organized with categories. It’s mobile-friendly. The UX might not be as sleek as a modern corporate site, but the value of content keeps users engaged. She has an email newsletter which also indicates recurring engagement with her audience.  
5. **Speech Fox (speechfox.com)** – *Melanie Fox – Focus:* Accent reduction & dialect coaching (NYC-based).  
   * **SEO Strength:** SpeechFox targets a specific niche (accent and speech clarity) and uses a memorable brand name. They likely rank on the first page for “accent reduction NYC” and similar terms. Their traffic may be lower overall, but very targeted.  
   * **Content Strategy:** They have a professional site with service descriptions and probably some blog content or FAQs about accent training. Perhaps they share before-and-after client stories (which can attract interest). They also list package pricing (which can attract searches like “accent reduction cost”).  
   * **Backlinks:** Given their niche, they might have links from ESL (English as Second Language) communities or referrals from speech therapy forums. Also, being active on LinkedIn or industry blogs can get them mentions. However, they may not have many high-authority links; their SEO might rely more on good on-page optimization for their niche keywords.  
   * **UX:** Very focused on conversion – their site likely invites visitors to book a consultation. The design is modern with clear info on the process (assessment, packages, etc.). It’s tuned to instill trust (Melanie’s credentials, client testimonials).

**Comparative Metrics Snapshot:**

| Metric | NY Speech Coaching | NY Vocal Coaching | Corp Speech Solutions | SpeakUpForSuccess | Herman Otten (PS NYC) |
| ----- | ----- | ----- | ----- | ----- | ----- |
| Domain Authority (Moz) | \~30 (med) | \~50+ (high) | \~30 (med) | \~40 (med-high) | \~20 (low) |
| Referring Domains (approx) | \~150 | 300+ | 100+ | 200+ | \<50 |
| Organic Keywords (est.) | \~300 | 1,000+ | 200+ | 500+ | 100+ |
| Top Ranking Topics | Speech coach NYC, accent reduction NYC, public speaking NYC (shares) | Voice lessons, vocal coach, singing lessons, *some speech overlap* | Accent reduction NYC, corporate speech training, presentation skills coaching | Public speaking tips, speech coach NYC, presentation coach, speech writing | Public speaking classes NYC, speech coach NYC, presentation class NYC |
| Notable Strength | Broad service offerings (many sub-niches), strong brand presence in NY, press mentions | Huge content library, global reach, high authority, celebrity social proof | Niche authority in corporate sector, strong credentials (SLPs), long establishment | Rich blog content, author expertise, E-A-T in speaking, good media presence | Exact-match domain, top local reviews, laser-focused offering, high conversion for that niche |

(*Metrics are estimated for comparison.*)

**Key Insights and Recommendations from Competitor Analysis:**

* **Content is King:** The competitors with the most success (NY Vocal Coaching, SpeakUpForSuccess) invest heavily in content. They attract visitors at all stages of the customer journey with free value (videos, blogs). NYSC should implement a comparable content strategy (as discussed) to compete on that front. Currently, not having a blog is a disadvantage especially against Jezra Kaye’s site which might answer many of the questions your potential clients have – capturing those leads. We can do better by launching a comprehensive blog that could outshine competitors (perhaps by leveraging multiple experts on the team to contribute, which is a unique strength).  
* **Authority & Link Building:** NY Vocal Coaching has a very high authority domain partially due to the global nature and lots of natural links. While you don’t directly compete in singing, their presence in “voice coaching” means they snag some search share. However, their focus on singing means NYSC can dominate the **speech-specific** space by building similar authority in that niche. Over time, through PR and link outreach, aim to increase NYSC’s domain rating into the 40s. This will help outrank Corporate Speech Solutions and SpeakUpForSuccess for overlapping terms because you’ll have both relevance *and* authority.  
* **User Experience & Conversion:** Herman Otten’s and Corporate Speech’s sites show the importance of clear value proposition and strong calls to action. Herman’s site immediately tells you he’s the “best rated” and prompts you to sign up. Corporate Speech emphasizes their proven methods for professionals. NYSC can incorporate some of these elements in the redesign: prominently display your unique selling points (e.g. “15+ years in business, 5-star rated by clients, featured in Esquire and HuffPost”), and have obvious next steps (consultation booking, etc.). In terms of pure UX, NYSC’s site is already visually appealing, but adding more trust signals (like logos, testimonials on the front page) could further boost conversion in line with competitor tactics.  
* **Keyword Targeting Differences:** Each competitor targets a slightly different set of keywords based on their niche:  
  * SpeakUpForSuccess targets “public speaking coach” and a lot of informational queries.  
  * Corporate Speech targets “accent reduction” and “executive communication”.  
  * Herman targets “public speaking classes” and related.  
  * NY Vocal Coaching targets “voice lessons” primarily.  
  * **NYSC spans all these sub-areas, which is a strength but also a challenge** – it means you need to rank for a wider range of keywords. The content silo approach can help here: create dedicated sections or mini-hub pages for each major service area (Public Speaking, Accent, Voice, Executive, etc.) and support them with blog content. Essentially, compete with each competitor in their specialty on your own site:  
    * E.g. a resource hub on **Accent & Dialect Coaching** on NYSC’s site could compete with SpeechFox and CorporateSpeech for accent queries.  
    * A series of **Public Speaking articles and class pages** competes with Herman and Jezra.  
    * The broad base of offerings competes with any new entrants by covering all topics comprehensively.  
* **Local SEO Competitors:** On the local maps front, aside from the above, there are speech-language pathologist offices and elocution specialists (like Brooklyn Letters, Manhattan Speech Language, etc ([Manhattan NYC Speech Coaching: Expert Communication Training](https://brooklynletters.com/manhattan-nyc-speech-coaching/#:~:text=Manhattan%20NYC%20Speech%20Coaching%3A%20Expert,Selinger%20is%20a%20New))】) that appear for related searches. They might not be direct business competitors (some focus on therapy), but from an SEO perspective they occupy SERP real estate. Through strong local SEO (Google reviews, etc.), NYSC can aim to outrank those in local pack results for queries like “speech training New York” or “elocution coach NYC.” Already NYSC is recognized (being listed on Yelp’s top 1 ([THE BEST 10 SPEECH TRAINING in NEW YORK, NY \- Yelp](https://www.yelp.com/search?cflt=speechtraining&find_loc=New+York%2C+NY#:~:text=THE%20BEST%2010%20SPEECH%20TRAINING,11%20New%20York%2C%20NY%2010018))】 and presumably in Google Maps), so pushing more reviews and local content can secure the top spot.  
* **Social Proof:** Many competitors highlight testimonials and client success (Herman’s “100+ reviews”, Corporate’s case studies, NYVC’s celebrity clients). NYSC has many satisfied clients; showcase them more. Perhaps integrate a rotating testimonial slider on the homepage or a dedicated testimonials page categorized by service (e.g. one from a corporate exec, one from an actor, one from a non-native speaker, etc. – demonstrating breadth of impact). This not only aids conversion but also contributes to E-A-T (real-world proof of effectiveness).  
* **Emerging Competitors & Online Marketplaces:** Also note indirect competitors like **Udemy or Coursera courses on public speaking**, or AI speech coaching apps (e.g. Yoodli – an AI speech coach). While these aren’t direct service competitors, they rank for relevant keywords (someone might search “public speaking coach” and stumble on an app or course). Emphasize the human expert advantage in your content. Perhaps write a comparison blog (“AI Speech Apps vs. Real Speech Coaching – What You Need to Know”) to capture those curious about alternatives and gently persuade them that a personalized approach is superior. This way, even new digital competitors become a source of traffic for you rather than a loss.

**Conclusion of Competitor Analysis:** New York Speech Coaching is well-positioned in that it combines many of the strengths of individual competitors (breadth of services like Corporate Speech Solutions, expertise and content potential like SpeakUpForSuccess, strong brand name like New York Vocal Coaching, and local reputation like Herman Otten). The gap has been in fully capitalizing on SEO. By implementing the recommendations in technical, on-page, content, and off-page areas, NYSC can progressively overtake these competitors in search rankings. Specifically, the strategy to **build a content-rich site with high authority** will allow NYSC to rank for a wide array of keywords – potentially making it outrank even niche sites for their niche terms due to the site’s overall strength.

For example, imagine a search for “best speech coach NYC.” In the future, an ideal outcome is:

* NYSC’s Google Business listing appears with a 5★ rating,  
* NYSC’s website is the first organic result (perhaps with sitelinks to Services, Rates, etc.),  
* followed by Herman’s site or Jezra’s blog.

This scenario is achievable with the planned improvements. Constantly monitor competitor moves (if they up their content game or start targeting new keywords) so we can adjust. SEO is dynamic, but with NYSC’s rich real-world expertise and these optimizations, it can become the **undisputed online leader** in the New York speech coaching scene and a major player globally for English speech improvement.

---

Having analyzed all these aspects, we can now outline specific recommendations prioritized by their impact and ease of implementation, and assign them to the relevant teams (Design/UX, Content, Development) in the next section.

## **Actionable Recommendations (Prioritized by Impact & Ease)**

Below, we present a consolidated action plan divided by team responsibility. Each recommendation is labeled with its **priority** – considering impact on SEO/UX and the **ease of implementation**:

### **For Design/UX Team**

These tasks improve user experience and conversion rate, which indirectly boost SEO by improving engagement metrics and making the site more effective at turning visitors into clients.

### **For Content Team**

These tasks focus on creating and optimizing content. They are crucial for ranking improvements and attracting traffic.

### **For Development Team**

These tasks involve technical changes, performance improvements, and schema implementations.

**Prioritization Key:** We recommend tackling the **high-impact, low-effort** items first – these are the “quick wins” that can yield visible improvements in rankings or user experience relatively quickly. This includes things like updating title tags, adding schema, compressing images, and adding clear CTAs – many of which can be done in the early stages of the redesign project.

Next, the **high-impact, higher-effort** tasks like launching the blog and producing content should be started soon as well, because content marketing is a longer-term play (it takes time to create and for Google to index and rank this content). The content team can begin creating drafts even while the developers work on technical fixes – so that by the time the new blog is set up, you have posts ready to publish.

Medium impact items should follow – e.g., expanding content depth and enhancing design elements. Many medium-impact changes will further boost conversion rates (which effectively improves ROI of your SEO traffic).

Low impact items, while not urgent, should not be forgotten – they often contribute to cumulative gains or prevent future issues (like analytics setup and regular content refresh to keep things from getting stale).

By following this implementation plan, within the next 3-6 months you should see:

* Higher rankings for target keywords (due to improved on-page SEO and new content).  
* More organic traffic (as content draws in visitors and technical fixes allow Google to crawl more efficiently).  
* Better user engagement metrics: lower bounce rate, higher pages per session (as internal linking and content keep users exploring).  
* Increased conversion of visitors to inquiries (thanks to UX improvements and clearer calls-to-action).  
* A stronger online presence overall – reflected in metrics like Domain Authority climbing as backlinks accrue, and perhaps Google starting to feature your content in rich snippets or answer boxes (especially with FAQ and good content).

Each team should coordinate to ensure changes are complementary (e.g., content is written with SEO in mind, and developers implement it in a crawlable, user-friendly way, with design making it attractive). Setting up periodic reviews (say monthly SEO check-ins) to assess progress and adjust the strategy will keep the momentum.

Finally, remain adaptive: SEO is an ongoing process. Monitor competitor moves – if they ramp up efforts, respond in kind. Stay updated with SEO best practices (algorithm updates in 2025 might, for example, put more weight on AI content or something – be ready to adapt content strategy as needed). The audit gives a roadmap for the current situation; maintaining top rankings will require continuous refinement and effort in line with this roadmap.

With this comprehensive approach addressing technical foundation, on-page optimization, content expansion, off-page authority building, local targeting, mobile performance, and an eye on the competition, **New York Speech Coaching will be poised to achieve and sustain \#1 positions** for your most important keywords, attract more qualified traffic, and ultimately convert more visitors into clients.

Based on the audit of **NewYorkSpeechCoaching.com**, here’s a breakdown addressing your questions for use in a **competing site build**:  
---

### **1\. Elements to Include in Your Client’s Competing Website**

These are features that are effective on NYSC’s site and worth replicating:

#### **A. Service-Specific Landing Pages**

* Separate pages for Public Speaking, Accent Reduction, Executive Presence, etc.  
* Each page targets a clear keyword cluster and audience intent.

#### **B. Clear Navigation & Logical Architecture**

* Simple nav with dropdowns for Services, Team, Locations, Contact.

#### **C. Professional Tone & Design Aesthetic**

* Clean layout, clear typography, emotionally resonant language.  
* Communicates trust and expertise.

#### **D. Trust Signals**

* Press mentions (logos of HuffPost, Esquire), media features, credentials.

#### **E. Coach Profiles**

* Pages with bios, credentials, and teaching philosophies.

#### **F. Location Pages**

* Dedicated content for NYC, Savannah, DC.

#### **G. Mobile Responsiveness**

* Layout adjusts smoothly on mobile (despite minor speed issues).

#### **H. Scheduling Integration**

* Easy booking via links or external system.

#### **I. Testimonials**

* Embedded client quotes and social proof throughout.

---

### **2\. How to Improve on These Elements**

#### **A. Service Pages**

**Improve by**:

* Adding in-depth content (500–800+ words).  
* Including FAQs, case studies, and internal links to related services.  
* Use clear CTAs per page (e.g., “Book a Public Speaking Session”).

#### **B. Navigation**

**Improve by**:

* Making nav sticky for better mobile UX.  
* Including icons or visual cues in dropdowns for faster scanning.

#### **C. Design & Tone**

**Improve by**:

* Using conversion-optimized design (FOMO buttons, sticky CTAs).  
* Inject slightly more visual storytelling (photos, video testimonials).

#### **D. Trust Signals**

**Improve by**:

* Adding third-party trust badges (Google Reviews, BBB).  
* Show star ratings with aggregate review schema.

#### **E. Coach Profiles**

**Improve by**:

* Include intro videos for coaches.  
* Add availability, specialties, and a CTA to book that coach.

#### **F. Location Pages**

**Improve by**:

* Use LocalBusiness schema.  
* Add embedded map, contact form, local FAQs.  
* Mention nearby landmarks/neighborhoods to boost local intent signals.

#### **G. Mobile UX**

**Improve by**:

* Adding a sticky “Call Now” or “Book Session” footer bar.  
* Optimize Core Web Vitals aggressively (aim LCP \<2.5s, CLS \<0.1).

#### **H. Scheduling**

**Improve by**:

* Integrate directly within your site if possible (avoid external redirects).  
* Offer instant booking with availability calendar \+ timezone support.

#### **I. Testimonials**

**Improve by**:

* Use video testimonials.  
* Segment by service (e.g., Business, Accent, Public Speaking).  
* Show them in carousels or hover cards with faces and names.

---

### **3\. Elements to *Avoid* Including**

#### **A. Overreliance on External Scheduling Links**

* Redirecting to a different domain for scheduling hurts UX and trust.

#### **B. Inconsistent Heading Structure**

* Avoid H2s before H1s or skipping heading levels – it confuses crawlers.

#### **C. Overuse of Abstract Copy**

* Phrases like “a voice you love” are emotionally resonant but vague.  
* Instead: pair emotional with functional (“Overcome stage fright with 1:1 coaching”).

#### **D. Lack of Fresh Blog Content**

* NYSC lacks a blog or insight section – don’t repeat this.  
* Competitors with blogs outrank for many long-tail queries.

#### **E. Unclear Meta Titles and Descriptions**

* Many pages use generic or overly long meta titles – fix this with keyword-focused, concise versions.

#### **F. Low Schema Usage**

* NYSC lacks structured data like FAQPage, LocalBusiness, Review. Include this on your site.

#### **G. Slow Mobile Load**

* Especially image-heavy backgrounds slow LCP. Avoid large, unoptimized hero images.

LLM readable

\#\# Learning from the Biggest Competitor

\#\#\# What to Implement, But Better

These are the effective elements used by NewYorkSpeechCoaching.com and how to improve on them in the new site:

\- \*\*Service-Specific Pages\*\*    
  \_What they do:\_ Separate pages for each service (Public Speaking, Accent Reduction, etc.)    
  \_Improve by:\_ Expanding content (500–800+ words), adding structured FAQs, testimonials, and internal linking. Each page should have a clear CTA.

\- \*\*Clean Navigation & Site Architecture\*\*    
  \_What they do:\_ Logical dropdown structure with Services, Team, Contact, Locations.    
  \_Improve by:\_ Making the nav sticky on scroll, adding icons or tags to clarify sub-sections.

\- \*\*Professional Visual Tone\*\*    
  \_What they do:\_ Clean layout, emotional language, quality photos.    
  \_Improve by:\_ Use conversion-optimized layouts with strong value propositions and CTAs, better mobile responsiveness, and visual storytelling (e.g., coach video intros).

\- \*\*Coach Bio Pages\*\*    
  \_What they do:\_ Individual bios with photos and brief descriptions.    
  \_Improve by:\_ Adding short intro videos, specialties, and direct booking links for each coach.

\- \*\*Trust Signals (Media Mentions, Logos)\*\*    
  \_What they do:\_ Display press features and media logos.    
  \_Improve by:\_ Add review aggregators (Google stars), trust badges, video testimonials, and review schema markup.

\- \*\*Location-Based Pages\*\*    
  \_What they do:\_ Have pages for NYC, Savannah, and DC.    
  \_Improve by:\_ Adding \`LocalBusiness\` schema, Google Maps embeds, embedded reviews, localized content blocks, and unique FAQ sections per location.

\- \*\*Scheduling System\*\*    
  \_What they do:\_ External booking links.    
  \_Improve by:\_ Embedding native scheduling functionality directly on the site with timezone conversion and live availability.

\- \*\*Testimonials\*\*    
  \_What they do:\_ Embedded in-page quotes.    
  \_Improve by:\_ Using segmented testimonials (by service), video snippets, and a testimonials hub page with filters.

\- \*\*Mobile Responsiveness\*\*    
  \_What they do:\_ Mobile layout adjusts without major issues.    
  \_Improve by:\_ Optimizing Core Web Vitals (LCP \<2.5s), adding sticky mobile CTAs (e.g., “📞 Call Now” bar), and testing all elements on multiple devices.

\---

\#\#\# What to Avoid

These are the flaws and weaknesses on the competitor’s site and how to improve on them:

\- \*\*External Scheduling Platform\*\*    
  \_Problem:\_ Clicking to book redirects to a separate site.    
  \_Fix:\_ Implement native scheduling that’s fast, secure, and consistent with your UI.

\- \*\*Thin Content on Some Pages\*\*    
  \_Problem:\_ Several sub-services only have 1–2 sentence descriptions.    
  \_Fix:\_ Expand to include real examples, coach tips, and structured content for each offering.

\- \*\*Vague Meta Titles/Descriptions\*\*    
  \_Problem:\_ Long, unfocused titles and missing meta descriptions.    
  \_Fix:\_ Write concise, keyword-focused titles and persuasive meta descriptions with CTAs.

\- \*\*No Blog or Content Hub\*\*    
  \_Problem:\_ Lacks long-form content targeting long-tail SEO terms.    
  \_Fix:\_ Launch a blog with weekly posts covering speech tips, coaching stories, FAQs, and SEO-driven topics.

\- \*\*Minimal Structured Data (Schema)\*\*    
  \_Problem:\_ No FAQ, Review, or LocalBusiness markup.    
  \_Fix:\_ Add JSON-LD schema for LocalBusiness, FAQPage, Reviews, and Person (for coach profiles).

\- \*\*Low Mobile Speed Scores\*\*    
  \_Problem:\_ Hero images and scripts slow down mobile load time.    
  \_Fix:\_ Optimize media (WebP, lazy loading), compress scripts, and prioritize Core Web Vitals.

\- \*\*Heading Hierarchy Issues\*\*    
  \_Problem:\_ Missing or misused H1 tags; inconsistent header structure.    
  \_Fix:\_ Use exactly one H1 per page, with proper nesting (H2, H3) for SEO and accessibility.

\- \*\*Lack of Internal Linking Strategy\*\*    
  \_Problem:\_ Limited contextual links between service pages and no content to support internal linking.    
  \_Fix:\_ Build topic clusters using service pages \+ blog posts with rich interlinking and clear anchor text.

\- \*\*No On-Site Search Function\*\*    
  \_Problem:\_ Users can’t search content (important as content scales).    
  \_Fix:\_ Include an accessible search function, especially on mobile.

\- \*\*Unclear or Weak Call-to-Actions\*\*    
  \_Problem:\_ Some pages end without strong next-step prompts.    
  \_Fix:\_ Add prominent CTAs after content sections and floating CTA buttons on mobile.

\---

