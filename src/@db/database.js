import ADSK_Build from '../assets/images/product/logos/ADSK-Build.png';
import ADSK_BIM_Collaborate from '../assets/images/product/logos/ADSK-BIM-Collaborate.png';
import ADSK_Docs from '../assets/images/product/logos/ADSK-Docs.png';
import ADSK_Quantify from '../assets/images/product/logos/ADSK-Quantify.png';
import Assemble from '../assets/images/product/logos/Assemble.png';
import BuildingConnected from '../assets/images/product/logos/BuildingConnected.png';

export const iconicBuildingInfo = {
	"hot_EMEA": {
		index: 'rpbxyy3m64',
		padding: '56.25%'
	},
	"hot_EMEA_other": {
		index: '55ks5vhfck',
		padding: '44.17%'
	},
	"hot_AMERICA": {
		index: 'rpbxyy3m64',
		padding: '56.25%'
	},
	"hot_ACPA": {
		index: 'rpbxyy3m64',
		padding: '56.25%'
	}
}

export const products = [
	{ 
		title: 'Autodesk Build', 
		logo: ADSK_Build,
		type: 'product',
		capabilities: 'Change Management, Commissioning, Cost Management, Facilities Management, Handover, Logistics Planning, Quality Management, Resource Management, Safety Management, Site Administration, Sustainability Management, Visualisation, Work Packaging', 
		description: 'Autodesk Build is comprehensive field and project management software that delivers a broad, deep and connected set of tools for builders.', 
		murl: 'https://construction.autodesk.com/products/build' 
	},
	{ 
		title: 'Autodesk Quantify', 
		logo: ADSK_Quantify,
		type: 'product',
		capabilities: 'Quantification', 
		description: 'Autodesk Quantify allows estimators to create competitive bids faster by performing more accurate 2D takeoffs and generating automatic quantities from 3D models within a single takeoff solution.', 
		murl: 'https://construction.autodesk.com/products/quantify' 
	},
	{ 
		title: 'Autodesk Docs', 
		logo: ADSK_Docs,
		type: 'product',
		capabilities: 'Change Management, Data Hosting, Design Detailing, Document Management, Visualisation', 
		description: 'Autodesk Docs is a centralized document management solution that acts as a single source of truth across the project lifecycle for all project teams.', 
		murl: 'https://construction.autodesk.com/products/docs' 
	},
	{ 
		title: 'Autodesk BIM Collaborate', 
		logo: ADSK_BIM_Collaborate,
		type: 'product',
		capabilities: 'Coordination, Design Authoring, Design Collaboration, Design Detailing, Visualization', 
		description: 'Autodesk BIM Collaborate connects designers, trades, and construction teams to automate and manage design collaboration and model coordination processes to deliver high-quality construction documents.', 
		murl: 'https://construction.autodesk.com/products/bim-collaborate' 
	},
	{ 
		title: 'TradeTapp', 
		type: 'product',
		capabilities: 'Qualification', 
		description: 'TradeTapp streamlines contractor qualification and risk management with automated and customizable risk analysis, benchmarking, and mitigation recommendations.', 
		murl: 'https://construction.autodesk.com/products/tradetapp' 
	},
	{ 
		title: 'Bid Board Pro', 
		type: 'product',
		capabilities: 'Quantification', 
		description: 'Bid Board Pro moves the bid management process online for subcontractors, tracking all opportunities and win rates in one centralized place.',
		murl: 'https://construction.autodesk.com/products/bid-board-pro' 
	},
	{ 
		title: 'BuildingConnected Pro', 
		logo: BuildingConnected,
		type: 'product',
		capabilities: 'Bid Management, Estimating', 
		description: 'BuildingConnected Pro lets owners and general contractors discover, invite, and choose the right builder with bid management capabilities that leverage the most accurate, crowd-sourced Builders Network. ', 
		murl: 'https://construction.autodesk.com/products/buildingconnected-pro' 
	},
	{ 
		title: 'Assemble', 
		logo: Assemble,
		type: 'product',
		capabilities: 'Model Conditioning, Quanitification', 
		description: 'With Assemble, General Contactors and design teams can access, analyze, condition, and share model-based building information to improve design reviews, takeoffs, estimating, change management, value engineering and schedule management.', 
		murl: 'https://construction.autodesk.com/products/assemble' 
	},
	{ 
		title: 'Pype', 
		type: 'product',
		capabilities: 'Project Management, Project Closeout', 
		description: 'Pype uses unparalleled machine-learning algorithms to elevate your project management process and help you achieve full contract compliance from precon through closeout', 
		murl: 'https://construction.autodesk.com/products/pype' 
	}
]

export const capabilities = [
	{
		title: 'Bid Management',
		type: 'capability',
		icon: 'icons/ico_bid-management.png',
		products: 'BC Pro, Bid Board Pro',
		description: 'Discover, invite and identify the right builder for the right project to ensure the right teams are chosen to mitigate risk and costs before breaking ground.',
		murl: 'https://construction.autodesk.com/workflows/construction-bid-management',
	},
	{
		title: 'Project Closeout',
		type: 'capability',
		products: 'Autodesk Build, Pype',
		description: 'Capture data and intelligence in the field to streamline project closeout and turn over the project to your client with complete confidence. ',
		murl: 'https://construction.autodesk.com/workflows/construction-closeout-project-handover',
	},
	{
		title: 'Coordination',
		type: 'capability',
		icon: 'icons/ico_model-cooridination.png',
		products: 'Autodesk Coordinate',
		description: 'The process of coordinating the design and trade input to ensure that the project can be executed as intended',
		murl: 'https://construction.autodesk.com/workflows/bim-coordination-collaboration',
	},
	{
		title: 'Cost Management',
		icon: 'icons/ico_cost-management.png',
		type: 'capability',
		products: 'Autodesk Build',
		description: `Gain a real-time view of a project's financial health and visualize cost-related risk by managing all cost-related construction activities in the cloud. `,
		murl: 'https://construction.autodesk.com/workflows/construction-cost-management',
	},
	{
		title: 'Design Collaboration',
		type: 'capability',
		products: 'Autodesk Coordinate',
		description: 'The process of design teams collaborating on the development of a single model (Revit)',
		murl: 'https://construction.autodesk.com/workflows/design-collaboration',
	},
	{
		title: 'Document Management',
		type: 'capability',
		icon: 'icons/ico_document-management.png',
		products: 'Autodesk Docs',
		description: 'Organize, distribute, and share files across the project lifecycle with a single document management platform. Create a single source of truth, ensuring teams have access to the information they need from anywhere, anytime, on any device. ',
		murl: 'https://construction.autodesk.com/workflows/construction-document-management',
	},
	{
		title: 'Facilities Management',
		type: 'capability',
		products: 'Autodesk Build',
		description: 'Connect BIM asset data and building IoT alerts to maintenance technicians, when they need it, where they need it. ',
		murl: 'https://construction.autodesk.com/workflows/facility-management',
	},
	{
		title: 'Qualification',
		type: 'capability',
		products: 'TradeTapp',
		description: `The process of qualifying and maintaining subcontractor's qualifications to work on projects.`,
		murl: 'https://construction.autodesk.com/workflows/subcontractor-qualification-risk-assessment',
	},
	{
		title: 'Quality Management',
		type: 'capability',
		icon: 'icons/ico_quality-management.png',
		products: 'Autodesk Build',
		description: 'Gain visibility into all project issues and resolve them earlier with a proactive construction quality control process. Reduce costly rework and keep projects on schedule.',
		murl: 'https://construction.autodesk.com/workflows/construction-quality-management',
	},
	{
		title: 'Quantification',
		type: 'capability',
		icon: 'icons/ico_quantification.png',
		products: 'BidBoard Pro, Autodesk Quantify',
		description: 'The process of extracting materials and quantities from a set of 2D or 3D designs',
		murl: 'https://construction.autodesk.com/workflows/construction-takeoff',
	},
	{
		title: 'Safety Management',
		type: 'capability',
		icon: 'icons/ico_safety-management.png',
		products: 'Autodesk Build',
		description: 'Develop repeatable safety programs that are easy to adopt and get all your team members involved in taking ownership of safety onsite.',
		murl: 'https://construction.autodesk.com/workflows/construction-site-safety ',
	},
	{
		title: 'Project Management',
		icon: 'icons/ico_project-management.png',
		type: 'capability',
		products: 'Autodesk Build, Pype',
		description: 'Streamline project management workflows to meet contractual obligations, ensure the project stays on track, and improve communication between the field and office.',
		murl: 'https://construction.autodesk.com/workflows/construction-project-management',
	},
	{
		title: 'Insights',
		type: 'capability',
		icon: 'icons/ico_insights.png',
		products: 'Autodesk Build, Autodesk Docs, Autodesk Coordinate',
		description: 'Harness the power of construction data by leveraging predictive analytics delivered through easy-to-deploy reports and dashboards that highlight and help mitigate risks. ',
		murl: 'https://construction.autodesk.com/workflows/construction-data-analytics',
	},
	{
		title: 'Model Conditioning',
		type: 'capability',
		icon: 'icons/ico_model-conditioning.png',
		products: 'Assemble',
		description: 'Condition models to help reduce project risk by expanding on the information of a project that can facilitate design reviews, takeoffs, estimating, change management, value engineering and schedule management.',
		murl: 'https://construction.autodesk.com/workflows/bim-data-model-conditioning',
	},
]