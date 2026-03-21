// Thesis submission requirements checklist by degree level
// Categories use Lucide icon names

export const checklistCategories = [
  {
    id: 'documentation',
    label: 'Core Documentation',
    icon: 'FileText',
    degreeLevel: 'all',
    items: [
      { id: 'doc-1', label: 'Thesis manuscript (hardbound)', essential: true },
      { id: 'doc-2', label: 'Soft-bound working copies (3 copies for panel)', essential: true },
      { id: 'doc-3', label: 'Digital copy on USB flash drive (PDF + source files)', essential: true },
      { id: 'doc-4', label: 'Title page with correct format', essential: true },
      { id: 'doc-5', label: 'Abstract (max 300 words)', essential: true },
      { id: 'doc-6', label: 'Table of contents, list of figures, list of tables', essential: false },
      { id: 'doc-7', label: 'Bibliography / References (APA format)', essential: true },
      { id: 'doc-8', label: 'Appendices (data, instruments, code, etc.)' , essential: false },
    ]
  },
  {
    id: 'approvals',
    label: 'Forms & Approvals',
    icon: 'ClipboardCheck',
    degreeLevel: 'all',
    items: [
      { id: 'apr-1', label: 'Adviser approval / endorsement form', essential: true },
      { id: 'apr-2', label: 'Panel members\' approval signatures', essential: true },
      { id: 'apr-3', label: 'Department chair endorsement', essential: true },
      { id: 'apr-4', label: 'Dean\'s office submission form', essential: true },
      { id: 'apr-5', label: 'Turnitin similarity report (below 20%)', essential: true },
      { id: 'apr-6', label: 'IRB clearance (if human subjects involved)', essential: false },
      { id: 'apr-7', label: 'Permission letters (if applicable)', essential: false },
    ]
  },
  {
    id: 'defense',
    label: 'Defense Preparation',
    icon: 'Presentation',
    degreeLevel: 'all',
    items: [
      { id: 'def-1', label: 'Defense slides (PowerPoint or PDF)', essential: true },
      { id: 'def-2', label: 'Printed handouts for panel (optional)', essential: false },
      { id: 'def-3', label: 'Demo or prototype ready (if applicable)', essential: false },
      { id: 'def-4', label: 'Room booking confirmed', essential: true },
      { id: 'def-5', label: 'Panel members notified and confirmed', essential: true },
      { id: 'def-6', label: 'Projector / laptop setup tested', essential: false },
    ]
  },
  {
    id: 'undergraduate',
    label: 'Undergraduate Specific',
    icon: 'GraduationCap',
    degreeLevel: 'undergraduate',
    items: [
      { id: 'ug-1', label: 'Capstone proposal form submitted', essential: true },
      { id: 'ug-2', label: 'Enrolment in thesis units (4 units both terms)', essential: true },
      { id: 'ug-3', label: 'Minimum grade of 2.0 in prerequisite courses', essential: false },
      { id: 'ug-4', label: 'Final grade form from thesis adviser', essential: true },
      { id: 'ug-5', label: 'Clearance from thesis laboratory (if lab used)', essential: false },
    ]
  },
  {
    id: 'graduate',
    label: 'Graduate Specific',
    icon: 'BookOpen',
    degreeLevel: 'graduate',
    items: [
      { id: 'gr-1', label: 'Comprehensive exam passed (Masteral)', essential: true },
      { id: 'gr-2', label: 'Residency requirement fulfilled', essential: true },
      { id: 'gr-3', label: 'Published / submitted journal paper (Doctoral)', essential: false },
      { id: 'gr-4', label: 'Graduate school application for graduation', essential: true },
      { id: 'gr-5', label: 'Language review certificate (if applicable)', essential: false },
      { id: 'gr-6', label: 'Oral candidacy exam passed (Ph.D.)', essential: false },
    ]
  },
  {
    id: 'repository',
    label: 'Animo Repository Upload',
    icon: 'Upload',
    degreeLevel: 'all',
    items: [
      { id: 'rep-1', label: 'Final PDF submitted to Animo Repository', essential: true },
      { id: 'rep-2', label: 'Metadata form filled (title, abstract, keywords)', essential: true },
      { id: 'rep-3', label: 'Non-exclusive license form signed', essential: true },
      { id: 'rep-4', label: 'Repository confirmation email saved', essential: false },
    ]
  },
]

export default checklistCategories
