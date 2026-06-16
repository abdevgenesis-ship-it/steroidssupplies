/**
 * Sync website CMS content from docs/docx-pages.json (parsed from Melatonin gummies uk.docx).
 * Run: node scripts/sync-docx-content.mjs
 */
import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "8fp9giy6";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;

if (!token) {
  console.error("Missing SANITY_API_TOKEN");
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: "2024-01-01", useCdn: false });

let keyCounter = 0;
function key() {
  keyCounter += 1;
  return `sync${keyCounter}`;
}

function parseInline(text) {
  const children = [];
  const pattern = /\*\*([^*]+)\*\*/g;
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      children.push({ _type: "span", _key: key(), text: text.slice(lastIndex, match.index), marks: [] });
    }
    children.push({ _type: "span", _key: key(), text: match[1], marks: ["strong"] });
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    children.push({ _type: "span", _key: key(), text: text.slice(lastIndex), marks: [] });
  }

  if (children.length === 0) {
    children.push({ _type: "span", _key: key(), text, marks: [] });
  }

  return children;
}

function block(text, style = "normal") {
  return { _type: "block", _key: key(), style, markDefs: [], children: parseInline(text) };
}

function plainBlock(text, style = "normal") {
  return {
    _type: "block",
    _key: key(),
    style,
    markDefs: [],
    children: [{ _type: "span", _key: key(), text, marks: [] }],
  };
}

const HOME_AUTHORITY_INTRO = [
  "**Melatonin gummies** are the UK's fastest-growing premium wellness trend, and at melatoningummiesuk.com, we make it easier than ever to buy the absolute best sleep brands at unbeatably low prices. As the premier digital distributor for both B2C retail shoppers and B2B commercial wholesale buyers across the UK and Ireland, our storefront is fully stocked with the most popular vitamin brands, including elite selections from Lemme and Natrol. Whether you are looking to order high-strength formula options for personal use or purchase bulk pallets for retail distribution, we guarantee an uncompromised supply chain, authentic products, secure checkout, and ultra-fast 48-hour delivery—with priority same-day shipping available for urgent orders.",
  "[[H2]]",
  "When searching for top-tier **melatonin gummies for sale**, sourcing authentic, certified inventory is critical for both individual health and commercial compliance. Our platform acts as a bridge, making available clinical-grade formulations that are often difficult to obtain through standard retail channels in the UK and Ireland. Every batch in our inventory undergoes strict quality assurance checking, ensuring that what is written on the label perfectly matches what is inside the gummy.",
  "For our commercial partners, we offer a streamlined bulk purchasing ecosystem. Navigating international supply lines can delay your domestic distribution, which is why our UK-based fulfillment infrastructure keeps thousands of units ready for immediate dispatch. We support local businesses, independent pharmacies, and wellness e-commerce stores with competitive pricing tiers that protect your profit margins.",
  "Finding the right sleep supplement means having access to various active strengths tailored to specific wellness requirements. We stock an extensive menu of items ranging from daily micro-doses to extra-strength nightly formulas:",
  "[[OUTRO]]",
  "**Accelerate Your Nighttime Recovery with Fast 48h Shipping Across the UK & Ireland**",
  "We understand that when your sleep cycle is disrupted, waiting weeks for international shipments is not an option. That is why we have engineered a rapid fulfillment network that serves every corner of England, Scotland, Wales, Northern Ireland, and the Republic of Ireland.",
  "Our logistics integration includes automated order processing: place your order before our daily cutoff time, and your items are packaged and handed to our shipping partners within hours. With standard 48-hour tracked delivery on all standard retail orders and premium same-day priority dispatch for commercial buyers, we ensure your supply chain never breaks.",
].join("\n\n");

const sleepSeoContent = [
  block(
    "**Sleep gummies** are revolutionizing nighttime wellness routines, and our curated collection offers the absolute finest selection of legal, non-prescription sleep formulas available for sale in the UK and Ireland. Whether your goal is to buy extra-strength adult blends to beat insomnia or order specialized nighttime support for your family, our store balances competitive consumer pricing with extensive B2B wholesale infrastructure. We stock everything from standard herbal adaptogens to advanced hormonal regulators, ensuring every customer finds their perfect match. Order today and take advantage of our ultra-reliable 48-hour tracked shipping networks, alongside priority same-day dispatch options designed to restore peaceful nights without delay.",
  ),
  block(
    "When shopping for high-performing **sleep gummies uk** buyers frequently face a choice between weak local alternatives or unverified international imports. At melatoningummiesuk.com, we remove that friction by collecting top-tier global brands under one roof, fully tested and optimized for rapid overnight assimilation. Our inventory focuses heavily on high-bioavailability active ingredients that soothe the nervous system, lower bedtime cortisol, and induce deep, uninterrupted sleep cycles.",
  ),
  block(
    "Every single product batch we host is kept in temperature-controlled domestic facilities right here in the UK. This lets us sidestep international customs delays, allowing us to guarantee a fixed, predictable supply chain for both our household retail shoppers and our corporate B2B storefront clients looking to secure stable bulk inventory.",
  ),
  block("Buy Specialized Nighttime Formulas: Magnesium, Adults, & Pediatric Options", "h2"),
  block(
    "Our digital e-commerce catalogue is systematically categorized by consumer demographic and compound type, making it simple to order exactly what your household or retail business requires:",
  ),
  block(
    "**Adult High-Strength Options:** Buy highly effective **sleep gummies for adults** or **sleeping gummies for adults** designed to combat persistent shifts in sleep schedules, travel jet lag, and high-stress sleeplessness.",
  ),
  block(
    "**Advanced Mineral Blends:** If you want to bypass hormonal supplements completely, you can order premium **magnesium gummies for sleep**, a targeted **magnesium gummy for sleep**, or broad-spectrum **magnesium sleep gummies** that encourage deep neuromuscular relaxation.",
  ),
  block(
    "**Safe Pediatric Selections:** For parents seeking gentle sleep regulators, we offer a safe inventory of **sleep gummies for kids** and **sleeping gummies for kids**, alongside premium **childrens sleep gummies** that help manage bedtime hyperactivity naturally.",
  ),
  block(
    "**Alternative Cannabinoids:** For those who qualify, you can securely browse and buy specialized **thc gummies for sleep** alternatives built for deep-tissue relaxation and anxiety relief.",
  ),
  block("Elevate Your Inventory and Personal Wellness with Premium Sleep Aid Gummies", "h2"),
  block(
    "Investing in premium **sleep aid gummies** shouldn't mean dealing with long shipping delays or paying premium market markup prices. Our direct-to-consumer digital business model cuts out corporate middlemen, allowing us to offer the lowest market prices across the UK and the Republic of Ireland.",
  ),
  block(
    "For domestic businesses, independent pharmacies, and online health retailers, our dedicated **wholesale sleep gummies** channel supplies instant access to commercial-grade volume discounts. Order today to experience our automated e-commerce fulfillment, detailed door-to-door transit tracking, and a firm 48-hour delivery guarantee that ensures you never run out of stock when you need it most.",
  ),
];

const lemmeSeoContent = [
  block(
    "**Lemme gummies**, created by Kourtney Kardashian Barker, have completely transformed the global beauty and wellness market with their scientifically backed, clean functional ingredients and highly aesthetic lifestyle appeal. At melatoningummiesuk.com, we are proud to act as the premier domestic gateway where you can buy the entire authentic line without dealing with expensive international shipping rates or long delays at customs. Whether your goal is to order individual retail jars for your daily routine or secure high-margin commercial inventory via our bulk B2B channel, we make this highly demanded collection available for immediate purchase. Shop our extensive stock today and enjoy best-in-market prices, secure transactional checkouts, and guaranteed 48-hour tracked shipping straight to your home or retail business location.",
  ),
  block(
    "Finding a reliable place to purchase **lemme gummies uk** inventory has historically been a massive headache for domestic wellness fans due to constant stockouts and exorbitant transatlantic shipping fees. Our specialized e-commerce storefront solves this problem completely by maintaining an uninterrupted, direct supply pipeline of certified-genuine items safely stored right here in our climate-controlled UK distribution centers. We do the heavy lifting of importing so that you can buy safely with complete confidence and total cost transparency.",
  ),
  block(
    "For our e-commerce business clients, independent beauty bars, and health stockists, the massive viral demand of this brand makes it an absolute must-have asset. By tapping into our dedicated distribution network, commercial buyers can purchase wholesale pallets at lower price points than anywhere else in the market, allowing you to maximize your local retail margins while promising your shoppers immediate, next-day fulfillment.",
  ),
  block("Order the Full Target Range: Sleep, Vaginal Health, & Metabolism Blends", "h2"),
  block(
    "Our e-commerce portal carries the complete premium line, allowing you to easily browse and order the exact targeted benefits your body or your customer base demands:",
  ),
  block(
    "**Premium Nighttime Support:** Buy the legendary **lemme sleep gummies**, the highly sought-after **lemme gummies sleep**, or standard **lemme melatonin gummies** to naturally induce a peaceful night's rest. We also stock **lemme sleep tight gummies** and **lemme gummies sleep uk** variants for specialized regional packaging preferences.",
  ),
  block(
    "**Targeted Feminine Care:** Order the incredibly popular **lemme purr gummies** or the maximum-strength **lemme purr vaginal probiotic gummies** to support microflora and intimate health. For wider therapeutic options, you can also buy **lemme vaginal gummies** or high-conversion **lemme libido gummies**.",
  ),
  block(
    "**Metabolism, Digestion, & Focus:** Buy **lemme debloat gummies** to ease daily bloating, order **lemme burn gummies** and **lemme curb gummies** for metabolic enhancement, or pick up **lemme focus gummies** and **lemme play gummies** for cognitive performance.",
  ),
  block(
    "**Beauty & Longevity:** Instantly secure **lemme glow gummies**, **lemme hair gummies**, or **lemme grow gummies** to upgrade your clean skin and hair wellness routines from the inside out.",
  ),
  block("The Ultimate Destination for Authentic Kardashian Sleep Gummies", "h2"),
  block(
    "When you choose to order from us, you are bypassing the complex logistics of international trade while securing elite, hard-to-find wellness solutions. We are fully committed to keeping our catalog priced competitively, guaranteeing that you receive your favorite premium products at the best prices on the market.",
  ),
  block(
    "Every single item sent out from our warehouse features automated end-to-end tracking data sent directly to your phone or email. Whether you are purchasing a single bottle of the classic **lemme gummy** formula or ordering hundreds of units of **best lemme gummies** mixes for your retail shelves, our structured 48-hour delivery timeline stands as a firm guarantee.",
  ),
];

const natrolSeoContent = [
  block(
    "**Natrol gummies** are globally recognized as the gold standard for clinical-strength sleep support, and our e-commerce platform makes it simpler than ever to buy this top-tier American brand straight from a domestic supply. As a dedicated distributor serving both everyday consumer retail (B2C) and high-volume commercial wholesale (B2B) markets across the UK and Ireland, we keep a massive inventory of authentic Natrol formulations ready for immediate dispatch. Whether you need to order maximum-potency adult formulas or gentle, pediatrician-recommended blends for your family, we provide premium products at the lowest market prices. Skip the weeks of international shipping delays and order today to secure a reliable, secure transaction backed by our guaranteed 48-hour tracked shipping network.",
  ),
  block(
    "When trying to buy authentic **natrol melatonin gummies** in the UK and Ireland, many consumers run into the trap of dealing with counterfeit batches or paying extortionate import fees from gray-market sellers. At melatoningummiesuk.com, we eliminate that risk entirely by holding massive, temperature-controlled stocks of verified-genuine import batches right here in our domestic fulfillment hubs. We do the complex importing work so your family or retail business can secure clean, non-habit-forming, 100% drug-free sleep aids with zero friction.",
  ),
  block(
    "For pharmacies, corporate wellness retailers, and independent health stockists, listing this specific brand is a massive driver of consumer trust. By ordering through our optimized B2B network, commercial buyers bypass international trade barriers, gaining immediate access to deep volume tier discounts and priority same-day shipping that keeps your business running smoothly.",
  ),
  block("Order by Strength and Demographic: 10mg, 5mg, and Child-Safe Blends", "h2"),
  block(
    "Our catalog is broken down by explicit dosage and targeted user need, making it incredibly easy to find and buy the exact product line your business or household requires:",
  ),
  block(
    "**Maximum Strength Adult Sleep Support:** Buy **natrol melatonin 10mg gummies**, **natrol melatonin 10 mg gummies**, or the highly efficient **natrol 10mg melatonin gummies** to quickly correct severe jet lag or deep sleep disruptions. You can also order **melatonin gummies natrol 10mg** or the premium **natrol melatonin gummies 10mg uk** regional variants.",
  ),
  block(
    "**Daily Maintenance & Moderate Strengths:** Order the classic **natrol melatonin gummies 5mg**, **natrol 5mg melatonin gummies**, or **natrol 5mg gummies** for balanced nightly support. We also keep a heavy stock of **melatonin gummies natrol 5mg** configurations.",
  ),
  block(
    "**Gentle, Pediatric-Approved Blends:** For parent-approved wellness, buy **natrol kids melatonin gummies**, **natrol kids melatonin gummies uk**, or **natrol melatonin gummies kids** to safely handle children's evening routines.",
  ),
  block(
    "**Broad-Spectrum and Baseline Formulations:** Easily browse and buy **natrol 1mg melatonin gummies**, baseline **natrol gummies**, or classic **melatonin natrol gummies** and **natrol gummies melatonin** variations for general supplementation.",
  ),
  block("The Most Reliable Source for Melatonin Gummies Natrol UK", "h2"),
  block(
    "When you choose to order your **natrol sleep gummies** through our storefront, you are investing in a seamless, premium e-commerce experience. We stand behind our promise of absolute cost transparency, making premium global health brands accessible to everyone at unmatched prices.",
  ),
  block(
    "Every shipment that leaves our warehouse features fully automated tracking updates sent directly to your screen. Whether you are a consumer buying a single bottle or a retail store manager looking to **buy natrol melatonin gummies** by the pallet, our rapid 48-hour delivery timeline is an absolute certainty.",
  ),
];

const aboutStoryBody = [
  plainBlock(
    "The modern wellness landscape moves faster than local supply chains can adapt. When major global brands introduce groundbreaking, scientifically validated, or highly viral functional supplements—such as Kourtney Kardashian's premium Lemme collection or Natrol's industry-leading, clinical-strength sleep formulations—consumers and retailers in the UK and Ireland are historically left facing a frustrating logistical barrier.",
  ),
  plainBlock(
    "Between exorbitant transatlantic freight costs, surprise customs duties, and multi-week delivery delays, accessing elite health products has been an expensive, unpredictable hurdle.",
  ),
  plainBlock(
    "Our platform was established to dismantle that hurdle permanently. We operate as a premier, dedicated domestic import and distribution network. By taking on the complex operational burdens of international freight sourcing, structural customs clearance, and regulatory compliance, we bridge the gap between premium global wellness manufacturers and the European market.",
  ),
];

const aboutMissionBody = [
  plainBlock(
    "We don't operate as a standard middleman broker or a drop-shipping portal. We maintain concrete, end-to-end control over our product pipeline to offer a completely unified supply solution:",
  ),
  plainBlock("Climate-Controlled Storage", "h3"),
  plainBlock(
    "Every batch of pectin-based functional gummies we import is housed in domestic fulfillment centers equipped with advanced climate controls to preserve active ingredients, guarantee shelf life, and prevent melting or structural degradation.",
  ),
  plainBlock("A Dual-Channel Fulfilment Engine", "h3"),
  plainBlock(
    "Our ecosystem is engineered to support both individual consumers looking for single-jar retail orders and enterprise stockists requiring scalable, high-volume B2B wholesale supply.",
  ),
  plainBlock("Immediate 48-Hour Despatch", "h3"),
  plainBlock(
    "By positioning all our inventory within central domestic hubs, we completely eliminate international customs queues, guaranteeing that every retail and commercial package arrives securely at its destination door within 48 hours.",
  ),
];

const complianceSections = [
  {
    _key: key(),
    _type: "legalSection",
    title: "Structural Overview of Our Compliance Operations",
    paragraphs: [
      "Operating a secure, transparent, and legally sound supply pipeline is the bedrock of our business. Because functional wellness formulations, vitamins, and specialized herbal complexes are subject to rigorous public health oversight, our internal compliance department continuously audits all inventory against the latest domestic legal standards.",
      "We take full, unequivocal ownership of the international trade declarations, chemical evaluations, and ingredient profiling required to ensure every product distributed from our hubs conforms precisely to local market laws.",
    ],
  },
  {
    _key: key(),
    _type: "legalSection",
    title: "1. Food Standards Agency (FSA) & EFSA Compliance",
    paragraphs: [
      "All active herbal extracts, adaptogens, and wellness elements featured across our premium collections (such as Ashwagandha, L-Theanine, and Bacillus coagulans cultures) are rigorously cross-referenced against the UK Food Standards Agency and European Food Safety Authority databases. We ensure that every item distributed qualifies as a safe food supplement under the Food Safety Act and matches the required labeling, nutrient declarations, and purity standards.",
    ],
  },
  {
    _key: key(),
    _type: "legalSection",
    title: "2. Medicine Controls and Ingredient Classification",
    paragraphs: [
      "We strictly respect the boundary between daily wellness supplements and prescription-controlled compounds. Under the Human Medicines Regulations, specific substances—such as high-potency Melatonin or targeted therapeutic additions—occupy tightly monitored legal classifications within the UK and the Republic of Ireland.",
      "**Important Cross-Border Legal Context:** In Ireland, all authorized melatonin-containing products are classified as prescription-only medicines under the Health Products Regulatory Agency (HPRA) and statutory instrument S.I. No. 540/2003. Similarly, the UK Medicines and Healthcare products Regulatory Agency (MHRA) treats pure melatonin as a medicinal substance rather than an over-the-counter dietary supplement.",
      "Because of this, our platform operates within an explicit **personal-use import and B2B distribution paradigm**. When an individual consumer chooses to place an online order through our web store, our platform operates as their authorized direct-to-consumer logistics agent. We handle the personal import framework, customs clearance declarations, and local delivery fees on the buyer's behalf, ensuring that the physical distribution of these international formulas aligns perfectly with applicable domestic importation provisions.",
    ],
  },
  {
    _key: key(),
    _type: "legalSection",
    title: "3. Rigorous Batch Testing & Quality Assurance Protocols",
    paragraphs: [
      "We do not accept third-party or unverified inventory sheets. Every shipment arriving at our loading docks undergoes strict quality control checks:",
    ],
    bullets: [
      "Verification that factory tamper-evident security seals are 100% intact.",
      "Independent matching of manufacturer batch numbers against official Certificates of Analysis (CoA).",
      "Detailed shelf-life checks to guarantee a minimum expiration runway of 12 months prior to shipping.",
    ],
  },
];

async function patch(id, fields) {
  await client.patch(id).set(fields).commit();
  console.log(`Patched ${id}`);
}

async function main() {
  const homePageId = (await client.fetch('*[_type == "homePage"][0]._id')) || "ff42da08-7a52-4d28-9f62-016a68ca4167";

  await patch(homePageId, {
    authorityIntro: HOME_AUTHORITY_INTRO,
    authorityHeading: "Melatonin Gummies for Sale: Premium Retail and Bulk B2B Distribution",
    authorityPoints: [
      {
        _key: key(),
        _type: "homeAuthorityPoint",
        title: "Daily Maintenance & Micro-Dosing",
        description:
          "Buy **1mg melatonin gummies**, **melatonin 1mg gummies**, or the highly sought-after **1mg gummy melatonin** for a gentle approach to regulating travel jet lag or resetting your internal clock.",
        iconKey: "badgeCheck",
      },
      {
        _key: key(),
        _type: "homeAuthorityPoint",
        title: "Moderate Strengths",
        description:
          "Order **3mg melatonin gummies** or **melatonin gummies 3mg** to address intermittent sleeplessness without over-supplementation.",
        iconKey: "walletCards",
      },
      {
        _key: key(),
        _type: "homeAuthorityPoint",
        title: "High-Strength Options",
        description:
          "For deep, restorative sleep support, we offer maximum-potency options. You can instantly buy **melatonin gummies 5mg**, **5mg melatonin gummies**, or the robust **melatonin 5mg gummies**. For those requiring maximum clinical support, we have **melatonin gummies 10mg**, **melatonin 10mg gummies**, and **melatonin 10 mg gummies** ready for immediate purchase.",
        iconKey: "shieldCheck",
      },
    ],
  });

  await patch("category-sleep-gummies", {
    seoContent: sleepSeoContent,
    categoryAuthorityHeadingTemplate: "Sleep Gummies UK: Premium Formulations for Restful Nights",
    categoryHeroHeading: "Sleep Gummies: Order the UK's Best Nighttime Formulas Online",
    shortDescription:
      "Buy Top-Quality Sleep Aid Gummies, Nighttime Melatonin Treats, and Magnesium Infusions at Unbeatable Prices with Rapid 48-Hour UK & Irish Delivery",
  });

  await patch("category-lemme-gummies", {
    seoContent: lemmeSeoContent,
    categoryAuthorityHeadingTemplate: "Lemme Gummies UK: Authentic Direct Imports for Retail and Business",
    categoryHeroHeading: "Lemme Gummies: Order the Viral Premium Wellness Collection Online",
    shortDescription:
      "Buy Authentic Lemme Sleep, Lemme Purr, and Lemme Debloat Functional Supplements at the Lowest Market Prices with Guaranteed 48-Hour Delivery Across the UK & Ireland",
  });

  await patch("category-natrol-gummies", {
    seoContent: natrolSeoContent,
    categoryAuthorityHeadingTemplate: "Natrol Melatonin Gummies: Sourcing Elite, Certified-Genuine Sleep Aids",
    categoryHeroHeading: "Natrol Gummies: Order America's #1 Melatonin Brand Online",
    shortDescription:
      "Buy Authentic Natrol Melatonin 10mg, 5mg, and Pediatric Sleep Formulations at the Best Prices with Guaranteed 48-Hour Delivery Across the UK & Ireland",
  });

  await patch("wholesalePage", {
    seoTitle: "Melatonin Gummies Wholesale: Bulk B2B Supplier UK & Ireland",
    seoDescription:
      "Order wholesale melatonin gummies and premium sleep brands in bulk. Buy Lemme, Natrol, and sleep aid gummies at lowest B2B market prices with priority same-day dispatch. Apply now!",
    heroBadge: "Bulk B2B Supply",
    heroHeading: "Melatonin Gummies Wholesale: Premium Bulk B2B Supply and Distribution",
    heroSecondaryHeading:
      "Buy High-Margin Sleep, Lemme, and Natrol Gummies in Bulk Volume Tiers with Guaranteed Low Prices and Rapid Priority Shipping Across the UK & Ireland",
    heroSubhead:
      "Offering **melatonin gummies wholesale** channels that remain stable, legally compliant, and cost-effective is the foundational mission supporting our entire B2B enterprise infrastructure. At melatoningummiesuk.com, we act as the absolute premier domestic distribution partner for independent pharmacies, wellness e-commerce stores, beauty salons, and large-scale retail stockists across the UK and the Republic of Ireland. We eliminate the immense financial risk, high customs tariffs, and months of administrative delays traditionally involved in importing premium global lines like Lemme and Natrol from overseas markets. By keeping thousands of authentic master cases ready for immediate dispatch in our temperature-controlled warehouses, we make it effortless for your enterprise to order premium inventory at the lowest wholesale prices on the market, backed by our ironclad 48-hour delivery or priority same-day shipping guarantees.",
    whyHeading: "Melatonin Gummy Wholesale: Maximize Retail Margins with Premium Brands",
    whyIntro:
      "When sourcing a reliable **melatonin gummy wholesale** supplier within the UK and Irish business landscapes, modern enterprise buyers require much more than just low unit prices. You need an uncompromised supply chain, strict batch testing verification, and flexible domestic credit terms that keep your business cash flow fluid. Our optimized digital merchant portal is tailored specifically to remove transactional friction, providing a seamless checkout environment where business procurement managers can select volume tiers and download tax-compliant invoicing instantly. Our infrastructure directly supports your corporate scalability. Consumer interest in functional supplements is hitting record highs, making viral products like Kardashian's Lemme line or clinical-strength Natrol variations incredibly lucrative layout options for your store shelves or online marketplace storefronts. By ordering directly from our domestic warehouse hubs, you bypass international freight hold-ups, protecting your business against standard consumer stockout frustrations.",
    benefits: [
      {
        _key: key(),
        title: "Clinical Strength Master Batches",
        description:
          "Order high-volume quantities of clinical-strength sleep aids to fulfill customer demands. Buy **wholesale sleep gummies** or high-concentration adult formulations that dominate consumer search queries.",
        iconKey: "package",
      },
      {
        _key: key(),
        title: "Branded Lifestyle Collections",
        description:
          "Secure high-margin stock of authentic Lemme wellness products. Order specialized bulk batches of Lemme Sleep, Lemme Purr, and Lemme Debloat to capitalize on premium viral social media marketing trends.",
        iconKey: "badgePercent",
      },
      {
        _key: key(),
        title: "Established Industry Leaders",
        description:
          "Maintain steady retail turnover by listing America's #1 sleep brand. Buy bulk quantities of Natrol Melatonin 10mg, 5mg, and specialized child-safe lines with immediate retail display-ready packaging.",
        iconKey: "boxes",
      },
      {
        _key: key(),
        title: "Maximum Cost Savings",
        description:
          "We bypass expensive middleman brokers by purchasing directly from primary manufacturer production lines, giving us the unique leverage to pass maximum cost savings straight onto your corporate budget sheet.",
        iconKey: "wallet",
      },
      {
        _key: key(),
        title: "Automated End-to-End Tracking",
        description:
          "Every corporate cargo order shipped from our distribution bays is treated with immediate logistics priority. We provide automated end-to-end multi-channel delivery tracking down to your exact warehouse loading bay or store entrance door.",
        iconKey: "truck",
      },
      {
        _key: key(),
        title: "48-Hour Delivery Guarantee",
        description:
          "Whether you are ordering a single starter mixed-carton box for an independent shop or arranging multi-pallet contract freight for a major retail chain, our streamlined fulfillment engine guarantees arrival within 48 hours—keeping your inventory levels high and your operational overhead comfortably low.",
        iconKey: "zap",
      },
    ],
    faqs: [
      {
        _key: key(),
        question: "What are the minimum order quantities (MOQs) for wholesale melatonin gummies?",
        answer:
          "Our B2B program is designed to support both small growing businesses and large enterprise networks. We offer a low entry threshold with standard starter cartons beginning at just 24 units per product line. Deeper wholesale volume price cuts trigger automatically at 500+ units and full-pallet quantities.",
      },
      {
        _key: key(),
        question: "How do you verify the brand authenticity of your bulk wholesale sleep gummies?",
        answer:
          "Brand integrity is our highest priority. Every single commercial delivery of **wholesale sleep gummies** and branded stock is shipped in original manufacturer master cases, complete with factory tamper-evident security seals, verifiable production run batch numbers, and full certificates of analysis (CoA) available upon request.",
      },
      {
        _key: key(),
        question: "Do you ship corporate B2B orders to the Republic of Ireland without custom delays?",
        answer:
          "Yes, absolutely. We operate a highly specialized cross-border logistics pathway serving the entire island of Ireland. All custom clearances, domestic import declarations, and trade tariffs are settled on our side before shipping, ensuring your bulk order arrives smoothly without unexpected fees or transit holdups.",
      },
      {
        _key: key(),
        question: "How can our retail business apply for a priority trade account with you?",
        answer:
          'Applying for a trade account takes less than five minutes. Simply click the "Apply for Trade Account" button on this page, fill out your company registration data and VAT details, and our commercial onboarding team will review and activate your wholesale buying profile within one business hour.',
      },
    ],
  });

  await patch("aboutPage", {
    seoDescription:
      "Learn how we became the trusted domestic gateway for premium global wellness brands in the UK and Ireland. We bridge the gap between US manufacturers and European buyers.",
    storyBody: aboutStoryBody,
    missionHeading: "What Sets Our Distribution Infrastructure Apart",
    missionBody: aboutMissionBody,
    teamBody: [],
    complianceIntro: "",
    compliancePoints: [
      {
        _key: key(),
        title: "Uncompromising Brand Authenticity",
        description:
          "Every single container shipped across our platform features its original factory tamper-evident security seal, accurate batch numbers, and verifiable laboratory verification data. We maintain a zero-tolerance policy against grey-market alternatives.",
      },
      {
        _key: key(),
        title: "Absolute Price Transparency",
        description:
          "We leverage massive bulk-purchasing power directly at the manufacturer level, allowing us to absorb massive shipping tariffs and pass maximum cost savings directly down to our consumer budgets and B2B trade partners.",
      },
    ],
  });

  await patch("contactPage", {
    formHeading: "Submit a Direct Assistance Request Ticket",
    paymentsNote:
      "If you represent an independent pharmacy chain, an e-commerce health storefront, a beauty salon group, or an authorized local health stockist, do not utilize general retail communication channels. Please navigate straight to our secure **Wholesale Application Portal** to upload your active VAT credential profile. Our commercial auditing staff activates approved high-volume account tier privileges within 60 minutes of submission.",
  });

  await patch("compliancePage", {
    title: "Legality, Compliance, and Cross-Border Operational Policies",
    description:
      "Review the exact legislative framework, domestic import protocols, and compliance standards governing the distribution of wellness formulas in the UK & Ireland.",
    sections: complianceSections,
  });

  console.log("Done syncing docx content to Sanity.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
