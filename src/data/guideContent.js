// Thesis Writing Guide content — 6 sections with accordion items
// Icon names are Lucide React icon names

export const guideSections = [
  {
    id: 'choosing-topic',
    title: 'Choosing a Topic',
    icon: 'Lightbulb',
    intro: 'The most important step in your thesis journey is selecting a research topic that is both personally meaningful and academically viable. A good topic solves a real problem, fits within your program, and can be completed within your available time and resources.',
    items: [
      {
        heading: 'How do I find a good research gap?',
        content: 'Read 15-20 recent papers (last 3-5 years) in your area of interest. Look at the "Future Work" sections — researchers often explicitly state what they could not address. The overlap between what has been done and what has not been done is your research gap.'
      },
      {
        heading: 'What makes a topic "researchable"?',
        content: 'A researchable topic has a clear problem statement, available data or participants, feasible methods within your budget and timeline, ethical clearance possibility, and relevance to your college or department\'s thrust areas.'
      },
      {
        heading: 'How specific should my topic be?',
        content: 'Very specific. "Machine learning" is a field. "A CNN-based approach for early detection of diabetic retinopathy using fundus images from Philippine hospitals" is a thesis topic. The more scoped your topic, the more manageable and focused your research becomes.'
      },
      {
        heading: 'Should I coordinate with my adviser early?',
        content: 'Absolutely. Approach potential advisers before your topic is fully formed. Many advisers have funded research projects and may offer you a related subtopic, which can provide access to data, lab resources, and co-authorship opportunities.'
      },
    ],
    proTip: 'Search Animo Repository first. If your exact topic has been done at DLSU in the last 5 years, you need to differentiate your contribution clearly. If it has never been done, verify why — sometimes a gap exists because the data is genuinely unavailable.'
  },
  {
    id: 'proposal',
    title: 'Writing the Proposal',
    icon: 'FileEdit',
    intro: 'The thesis proposal is your contract with the academic community. It commits you to a specific research direction and must convince your panel that your study is important, original, feasible, and well-designed.',
    items: [
      {
        heading: 'What chapters does a typical proposal include?',
        content: 'Chapter 1: Introduction (background, problem statement, objectives, significance, scope and limitations). Chapter 2: Review of Related Literature. Chapter 3: Methodology (research design, participants/data, instruments, procedure, analysis). Plus a timeline and bibliography.'
      },
      {
        heading: 'How long should a proposal be?',
        content: 'Typically 30-60 pages for undergraduate capstone proposals, 50-80 pages for masteral, and 80-120+ for doctoral. Length matters less than quality — every section must be justified and every claim must be cited.'
      },
      {
        heading: 'What do panel members look for in a proposal defense?',
        content: 'Clarity of the research gap, feasibility of the methodology, depth of the literature review, clear operationalization of variables or constructs, realistic timeline, and the researcher\'s command of the subject matter.'
      },
      {
        heading: 'How do I write a strong problem statement?',
        content: 'State the existing condition (what is), the desired condition (what should be), and the gap between them (the problem). Then explain why this gap matters and what happens if it remains unaddressed. Cite evidence for each claim.'
      },
    ],
    proTip: 'Print and read 3 approved thesis proposals from your department on Animo Repository before writing yours. Notice the structure, tone, depth of literature review, and how they justify their methodology. These are your department\'s implicit standards.'
  },
  {
    id: 'methodology',
    title: 'Research Methodology',
    icon: 'FlaskConical',
    intro: 'Methodology is the blueprint of your study. A weak methodology produces unreliable results no matter how interesting your topic. Your methods must be appropriate for your research questions, rigorous, replicable, and ethically sound.',
    items: [
      {
        heading: 'Quantitative vs. qualitative vs. mixed methods — which should I choose?',
        content: 'Quantitative suits testable hypotheses with measurable variables and large samples. Qualitative suits exploratory studies seeking meaning, experience, or process. Mixed methods combines both and is increasingly common in applied research. Your research question should dictate the approach — not the other way around.'
      },
      {
        heading: 'What is sampling and why does it matter?',
        content: 'Sampling determines who or what you study. Probability sampling (random, stratified, systematic) allows generalization. Non-probability sampling (purposive, convenience, snowball) is used when a specific population is required. Document your sampling rationale clearly — reviewers will scrutinize it.'
      },
      {
        heading: 'How do I ensure validity and reliability?',
        content: 'For surveys/instruments: conduct a pilot test, check Cronbach\'s alpha for internal consistency, and have experts review your items for content validity. For qualitative work: triangulate data sources, conduct member-checking, and maintain an audit trail. For experiments: control for confounding variables and use control groups.'
      },
      {
        heading: 'What statistical tools should I know for a quantitative thesis?',
        content: 'Descriptive statistics (mean, SD, frequency) for profiling. Pearson/Spearman correlation for relationships. t-test or ANOVA for group comparisons. Regression for prediction. Chi-square for categorical associations. Software: SPSS, R, or Python (SciPy/statsmodels). Use G*Power to justify your sample size.'
      },
    ],
    proTip: 'Write your data analysis plan before collecting data. Know exactly which statistical test you will use for each research question, what software you need, and what output you expect. Surprises during analysis usually mean your methodology was not thought through.'
  },
  {
    id: 'writing',
    title: 'Writing the Manuscript',
    icon: 'PenTool',
    intro: 'Academic writing is precise, evidence-based, and impersonal. Every claim must be supported. Every paragraph must connect to your research objectives. Writing a thesis is not a one-pass activity — expect multiple complete rewrites and hundreds of micro-edits.',
    items: [
      {
        heading: 'What is the standard thesis structure at DLSU?',
        content: 'Chapter 1: Introduction. Chapter 2: Review of Related Literature. Chapter 3: Methodology. Chapter 4: Results and Discussion. Chapter 5: Summary, Conclusions, and Recommendations. Plus abstract, acknowledgements, appendices, and bibliography.'
      },
      {
        heading: 'How do I write a good literature review?',
        content: 'A literature review is not a list of summaries — it is a synthesis. Group sources thematically, not chronologically. Identify agreements, contradictions, and gaps. Lead the reader to understand why your specific research question has not yet been answered. Use a minimum of 30 recent, peer-reviewed sources.'
      },
      {
        heading: 'How do I avoid plagiarism and self-plagiarism?',
        content: 'Cite every non-original idea, data point, or phrase. Even your own prior work needs citation. Use Turnitin before submitting drafts to your adviser — DLSU requires a similarity score below 20% (often lower per college). Paraphrase correctly: rewrite in your own words and still cite the source.'
      },
      {
        heading: 'What APA formatting rules are most commonly violated?',
        content: 'In-text citations with no corresponding bibliography entry (and vice versa). Incorrect handling of DOIs and URLs. Wrong capitalization of article titles. Missing issue/volume numbers for journals. Direct quotes without page numbers. Use Zotero or Mendeley to manage references — manual APA formatting leads to errors.'
      },
    ],
    proTip: 'Write every day, even if only for 25 minutes (Pomodoro technique). Academic writing is a muscle — inconsistent effort leads to inconsistent quality. Keep a "thesis journal" where you write freely about your ideas; formal writing becomes easier when you\'ve already processed your thinking informally.'
  },
  {
    id: 'defense',
    title: 'Preparing for Defense',
    icon: 'Presentation',
    intro: 'The oral defense is not a test of whether your results are "correct" — it is a test of whether you understand your own research deeply and can defend your choices under expert scrutiny. Preparation and practice are the only variables within your control.',
    items: [
      {
        heading: 'How many slides should my defense presentation have?',
        content: 'For a 20-minute presentation: 18-25 slides. Structure: title (1), overview (1), background/problem (2-3), objectives (1), methodology (3-4), key results (4-6), discussion/implications (2-3), conclusions and future work (2), bibliography snapshot (1). Never read directly from slides.'
      },
      {
        heading: 'What questions do panels typically ask?',
        content: 'Why this topic? Why this methodology and not an alternative? How did you ensure validity? What are the limitations and how do they affect your conclusions? What are the practical implications? What would you do differently? Prepare a 2-minute answer for each of these.'
      },
      {
        heading: 'How do I handle a question I cannot answer?',
        content: 'Say: "That is an excellent point. My study did not directly address that aspect because [reason]. However, based on my findings, I believe [educated inference]. This would be an important direction for future research." Never bluff. Panelists respect intellectual honesty.'
      },
      {
        heading: 'How many mock defenses should I do?',
        content: 'At least three: once alone (record yourself), once with classmates, and once in front of your adviser. Each round should surface different weaknesses. Focus on time management, clarity of explanation, and composure under pressure — not memorization.'
      },
    ],
    proTip: 'The week before your defense, do a full run-through in the actual room at the same time of day your defense is scheduled. Familiarity with the physical environment reduces anxiety significantly. Check projector setup, clicker batteries, and your laptop display output.'
  },
  {
    id: 'submission',
    title: 'Final Submission',
    icon: 'CheckSquare',
    intro: 'After a successful defense, you enter the revision and submission phase. This is where many students stall — revisions feel endless and the finish line keeps moving. The key is to address all panel comments systematically and submit within the deadline your college sets.',
    items: [
      {
        heading: 'How long do I have to incorporate panel revisions?',
        content: 'DLSU colleges typically give 4-8 weeks after the final defense to incorporate revisions, get adviser sign-off, and submit. Check your specific college\'s deadlines — missing the graduation application cutoff means waiting another semester.'
      },
      {
        heading: 'What does hardbound submission require?',
        content: 'Hardbound copies must use specific cover color per college (e.g., DLSU green for most colleges), with the title, author name, degree, and year in gold lettering. Spine must also be labeled. Check your college\'s graduate studies office for exact specifications — bookbinders near DLSU are familiar with these requirements.'
      },
      {
        heading: 'How do I upload to Animo Repository?',
        content: 'Submit the final PDF with all revisions incorporated to your library liaison. Complete the metadata form (title, author, abstract, keywords, degree level, college, year). Sign the non-exclusive distribution license. You will receive a confirmation email and a permanent Animo Repository URL for your thesis.'
      },
      {
        heading: 'Can I publish from my thesis?',
        content: 'Yes, and you should. Extract your strongest chapter or contribution and submit to a relevant journal or conference. DLSU recognizes faculty and student publication with incentives. Consult your adviser — many co-publish with their students. Check Scimago and Web of Science for Q1/Q2 journals in your field.'
      },
    ],
    proTip: 'Create a revision tracker: a shared document with your adviser that lists every panel comment, your response, and which manuscript section addresses it. Panelists who review your revisions will look for evidence that each comment was taken seriously — a tracker proves this.'
  },
]

export const quickFacts = [
  { label: 'University Founded', value: '1911' },
  { label: 'Main Campus', value: 'Taft Avenue, Manila' },
  { label: 'Undergraduate Programs', value: '80+' },
  { label: 'Graduate Programs', value: '50+' },
  { label: 'Animo Repository Records', value: '20,000+' },
  { label: 'Required Similarity Score', value: 'Below 20%' },
  { label: 'Thesis Units (UG)', value: '6 units (2 terms)' },
  { label: 'Citation Style', value: 'APA 7th Edition' },
]

export default guideSections
