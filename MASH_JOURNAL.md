# MASH: Mushroom Automation with Smart Hydro-environment using Flutter, NestJS, Next.js, PostgreSQL, SQLite and Firebase

**Authors**  
1. Irheil Mae S. Antang  
2. Ma. Catherine H. Bae  
3. Jin Harold A. Failana  
4. Kevin A. Llanes  
5. Jhon Keneth Ryan B. Namias  
6. Emannuel L. Pabua  
7. Ronan Renz T. Valencia  
8. Prof. Joemen G. Barrios, MIT

**Affiliation**  
Bachelor of Science in Computer Science, University of Caloocan City - North Campus

**Emails**  
1. antang.irheilmae.bscs2022@gmail.com  
2. bae.catherine.bscs2022@gmail.com  
3. failana.jin.bscs2022@gmail.com  
4. llanes.kevinbscs2022@gmail.com  
5. namias.jhonkenethryanbscs2022@gmail.com  
6. pabua.emannuelbscs2022@gmail.com  
7. valencia.ronanrenz27bscs2022@gmail.com  
8. joemen.barrios@ucc-caloocan.edu.ph

## Abstract
Mushroom cultivation faces challenges in maintaining stable environmental conditions, particularly in temperature and humidity control, which can affect yield consistency, operational efficiency, and market accessibility. To address these problems, this study developed M.A.S.H. (Mushroom Automation with Smart Hydro-Environment), an integrated system designed to enhance cultivation through IoT-based automation, real-time environmental monitoring, and a web-based e-commerce platform. The system utilizes IoT sensors to monitor environmental parameters inside an automated growing chamber, while a mobile application enables remote monitoring and system management. A web platform supports product management and online transactions. The system was developed using Flutter, NestJS, Next.js, PostgreSQL, SQLite, and Firebase. Evaluation results indicated that the system achieved a Good performance rating in terms of functionality, usability, reliability, and efficiency, demonstrating its effectiveness in supporting improved environmental control and digital market integration in mushroom production.

**Keywords:** Internet of Things (IoT), Smart agriculture, Artificial intelligence, E-commerce platform, Oyster mushroom cultivation

## Introduction
Mushroom cultivation is an important agricultural activity due to its nutritional value and economic potential. However, local production in the Philippines remains insufficient to meet increasing demand, with domestic supply covering only a small portion of the market (CTMRD, 2022). The global mushroom industry is also expected to experience continued growth, highlighting the need for more efficient cultivation methods (IMARC Group, 2024). Traditional mushroom farming often relies on manual monitoring of environmental factors such as temperature and humidity, which may result in inconsistent growing conditions and lower productivity (Rodriguez, 2024).

In recent years, the adoption of smart agriculture technologies has enabled farmers to improve productivity through the integration of Internet of Things (IoT), artificial intelligence, and automated monitoring systems. To address these challenges, this study developed the M.A.S.H. system, an IoT- and AI-based platform designed to automate environmental monitoring and support smart mushroom cultivation. The system integrates sensor-based data collection, automated environmental control, and digital monitoring tools to help growers maintain optimal conditions for mushroom production while reducing the need for constant manual supervision.

## General Objective
To develop and integrate an IoT-enabled AI system for the automated growing of White Oyster Mushrooms (Pleurotus florida) supported with an e-commerce platform to optimize sustainable, direct-to-consumer market access for small-scale Filipino farmers.

## Specific Objectives
1. To receive user inputs from both growers and consumers through the e-commerce platform, such as product listings, order placements, and payment data.
2. To capture key environmental data, specifically temperature, humidity, and CO2 levels, in real-time from within a mushroom growing chamber via an IoT device.
3. To load the fruiting bags for optimized placement within the chamber to ensure uniform exposure to controlled temperature, humidity, and CO2 levels.
4. To regulate airflow and automate environmental controls through actuators based on integrated AI analysis, thereby maintaining the prescribed environment.
5. To calculate proper growing state for white oyster mushrooms using an integrated AI model.
6. To manage product listings, inventory, orders, and payments via an integrated e-commerce platform connecting growers and consumers.
7. To provide real-time environmental data and system alerts through both an integrated LCD module and a mobile application for direct and remote monitoring.

## Project Scope
- **Indoor Mushroom Cultivation:** Controlled cultivation inside a sealed chamber designed to maintain optimal growing conditions and reduce contamination.
- **IoT Environmental Monitoring:** Real-time monitoring of temperature, humidity, and carbon dioxide levels using sensors connected to automated control systems.
- **Mobile Application for Growers:** A mobile application that provides real-time monitoring, remote control of actuators, and activity logging.
- **E-commerce Platform Integration:** A web-based e-commerce system that enables product listing, order processing, and online transactions to expand market access.
- **Real-Time and Offline Database Synchronization:** Data synchronization through cloud services with offline support using local storage, ensuring continuous operation and automatic updates once connectivity is restored.

## Project Limitation
- **Species Focus:** The system is designed only for white oyster mushrooms (Pleurotus florida) and does not cover other species with different environmental requirements.
- **Scale:** The implementation is limited to small-scale indoor farming and does not include large-scale or open-field operations.
- **Technology Accessibility:** The system requires stable internet connectivity for real-time monitoring and platform access, which may not be available in some areas.
- **Resource Constraints:** Issues related to device affordability, maintenance, and continuous power supply are outside the scope of this study.
- **E-Commerce Limitation:** The platform supports local transactions only and does not include nationwide shipping or cold-chain logistics. It is also web-based and does not have a dedicated mobile application.

## Related Literature
Recent studies have explored the integration of Internet of Things (IoT) technologies and artificial intelligence to optimize mushroom cultivation and expand market access for small-scale growers. Foffano et al. (2025) demonstrated that a compact IoT-enabled growing chamber using ESP32 microcontrollers and DHT22 sensors could automate humidity and temperature control, achieving up to 30% yield improvement compared to non-automated setups. Similarly, Kumar et al. (2025) proposed a cloud-connected smart farming system integrating multi-parameter sensors and automated actuators, reporting a 49% increase in oyster mushroom production alongside reduced growth cycles and minimized labor costs.

In the Philippine context, Villafuerte et al. (2025) developed an Arduino and ESP8266-based microclimate management system for Pleurotus ostreatus cultivation, yielding 64% faster growth and significantly higher harvests compared to non-controlled setups. Omar et al. (2023) further validated that IoT automation reduces contamination by up to 60%, reinforcing its practical value in resource-limited tropical settings. On the market side, ReelMind.ai (2025) and the Philippine Daily Inquirer (2024) highlight how AI-powered chatbots and e-commerce platforms have boosted MSME engagement and conversion rates, demonstrating the commercial viability of integrating digital tools with agricultural production.

Collectively, these studies confirm that IoT automation, real-time environmental monitoring, and digital platforms each contribute meaningfully to improving mushroom cultivation outcomes and market reach. However, most existing solutions address these components separately, leaving a gap for an integrated system that combines smart environmental control, mobile monitoring, e-commerce, and AI-assisted support, precisely what M.A.S.H. aims to provide.

## Technical Background
The following technologies were used in the development and implementation of the M.A.S.H. system.

- **Flutter** - Provided the cross-platform mobile framework for the MashGrow grower application, enabling offline-first monitoring with SQLite caching.
- **NestJS** - Served as the backend API framework handling REST endpoints, WebSocket notifications, MQTT IoT communication, authentication, order processing, and payment integration.
- **Next.js** - Built the MashMarket e-commerce platform, admin dashboard, and landing page with server-side rendering and real-time WebSocket updates.
- **PostgreSQL** - Served as the primary relational database hosted on Neon via Prisma ORM, storing user accounts, products, orders, and sensor telemetry with ACID transaction support.
- **SQLite** - Provided lightweight local storage on the Raspberry Pi gateway and Flutter mobile app for offline data buffering during network outages.
- **Firebase** - Handled user authentication via OAuth 2.0, real-time NoSQL data synchronization through Firestore, and media storage for product images and delivery photos.
- **Raspberry Pi 3 Model B** - Operated as the IoT edge gateway running a Flask local dashboard, MQTT client connections, automation rule execution, and serial communication with the Arduino.
- **Arduino Uno R3** - Controlled the chamber hardware, interfacing with dual SCD41 sensors for temperature, humidity, and CO2 measurement, and an 8-channel relay module for actuator switching with a safety watchdog mechanism.
- **MQTT (HiveMQ Cloud)** - Enabled lightweight, TLS-secured IoT messaging between the Raspberry Pi gateway and the NestJS backend for sensor telemetry and actuator commands.
- **Python (Flask)** - Ran the IoT gateway scripts including the local LCD dashboard, AI-based environmental analysis using Isolation Forest and Decision Tree, and sensor data buffering.
- **Redis (Upstash)** - Provided in-memory caching for API sessions, rate limiting, and frequently accessed data to reduce database query load.
- **Prisma ORM** - Managed type-safe database access between NestJS and PostgreSQL with auto-generated queries and schema migrations.
- **Tailwind CSS** - Styled all Next.js web interfaces with utility-first CSS for consistent, responsive design across devices.
- **Figma** - Used for creating UI wireframes, prototypes, and user flow diagrams for both mobile and web interfaces.
- **Sanity CMS** - Managed product catalog and marketing content as a headless CMS, queried via GROQ from Next.js frontends.

## Design and Methodology
The M.A.S.H. Project adopts the Agile Software Development Methodology, specifically the Scrum Framework, to ensure flexibility, collaboration, and continuous improvement throughout its development process. This approach enables the project team to deliver functional system components in iterative cycles, allowing for frequent testing, feedback, and refinement.

## System Architecture
**Figure 1. System Architecture Model**

Figure 1 shows the M.A.S.H. system architecture, organized into four layers that collectively handle environmental monitoring, cultivation automation, and e-commerce operations.

The **Frontend Layer** consists of a Flutter-based MASH.Grower Mobile Application for remote chamber monitoring and Next.js Web Applications serving as the MashMarket e-commerce platform and admin dashboard. Both connect to the backend via HTTPS and WebSocket, with the mobile app syncing through Firebase for authentication and real-time data, and the web apps querying Sanity.io CMS via GROQ for product content.

The **Backend Layer** runs a NestJS Monolithic API handling REST, WebSocket, and MQTT communication. It integrates PayMongo for payments, Lalamove for delivery, and Cal.com for scheduling, while accessing the database through Prisma ORM and the IoT layer via MQTT.

The **Data Layer** uses PostgreSQL on Neon as the primary database, Redis on Upstash for caching, and Sanity.io CMS for content. The Firebase Suite provides authentication, Firestore synchronization, and cloud storage.

The **IoT Edge Layer** connects three components in sequence: the HiveMQ Cloud MQTT Broker relays messages to the Raspberry Pi Gateway via TLS-encrypted MQTT, the Raspberry Pi executes automation rules and AI-based environmental analysis, and the Arduino Uno interfaces with dual SCD41 sensors for temperature, humidity, and CO2 measurement while controlling an 8-channel relay module, with a safety watchdog that disables all relays after five seconds without communication.

## Conceptual Framework
The M.A.S.H.: Mushroom Automation with Smart Hydro-environment using Flutter, NestJS, Next.js, PostgreSQL, SQLite and Firebase adopts an Input-Process-Output (IPO) conceptual framework to illustrate how the M.A.S.H. system integrates Internet of Things (IoT), Artificial Intelligence (AI), and an e-commerce platform to support oyster mushroom cultivation. The inputs consist of real-time environmental sensor data (e.g., temperature, humidity, CO2 levels) and transactional data from the e-commerce platform. During the process, AI and machine learning algorithms analyze the collected data to automatically regulate environmental conditions, while the system simultaneously manages online transactions, inventory, and user interactions through the digital platform. The outputs include automated environmental control actions, real-time monitoring dashboards, alerts, analytics reports, and e-commerce functionalities such as order tracking and sales management. These outputs aim to improve cultivation efficiency, support decision-making, and enhance the productivity and profitability of mushroom growers.

## Statistical Treatment of Data
**Table 1. Statistical Treatment of Data**

| Scale | Range | Descriptive Equivalent |
|---|---|---|
| 5 | 4.21 - 5.00 | Excellent |
| 4 | 3.41 - 4.20 | Good |
| 3 | 2.61 - 3.40 | Fair |
| 2 | 1.81 - 2.60 | Poor |
| 1 | 1.00 - 1.80 | Very Poor |

**Weighted Mean Formula:**  
`WM = [sum(f x)] / N`

Where:
- `WM` - Weighted Mean
- `f` - Frequency of responses
- `x` - Likert scale value
- `N` - Total number of respondents

**General Weighted Mean:**  
`GWM = [sum(WM)] / n`

Where:
- `GWM` - General Weighted Mean
- `WM` - Weighted Mean of each indicator
- `n` - Number of indicators

Table 1 presents the five-point Likert scale used for evaluation. WM computed each indicator's average score, while GWM summarized the overall system evaluation.

## Result and Discussion
This study evaluated the M.A.S.H. (Mushroom Automation with Smart Hydro-Environment) system using responses from 110 respondents, consisting of 100 users and 10 expert evaluators. The system was assessed using indicators derived from the ISO/IEC 25010 software quality model, including functional suitability, interaction capability, reliability, performance efficiency, and interface usability. Weighted mean analysis was applied to determine the perceived quality and effectiveness of the system.

**Table 2. Summary of Evaluation Criteria Users**

Table 2 shows the summary of evaluation criteria by users, indicating generally positive results across all measured dimensions. Functional suitability and interaction capability both obtained a weighted mean of 4.08 (Good), indicating that the system adequately supports automated environmental monitoring, cultivation management, and basic system interaction. Reliability recorded a weighted mean of 4.09 (Good), while performance efficiency achieved 4.14 (Good), suggesting that the system operates with stable and efficient performance. In terms of interface usability, the mobile application interface received 4.02 (Good), demonstrating that users found the application accessible for monitoring system conditions. The e-commerce web application interface obtained 3.98 (Good), indicating that the platform sufficiently supports product browsing and purchasing. Meanwhile, the seller e-commerce interface received 3.96 (Good), reflecting that administrative and product management functions operate effectively but may still benefit from further improvements. Overall system quality from user respondents achieved a weighted mean of 4.13 (Good), confirming that the system meets acceptable usability and functionality standards.

**Table 3. Summary of Evaluation Criteria by Experts**

Table 3 shows the summary of evaluation criteria by experts indicating the system's technical capabilities. Functional suitability obtained a weighted mean of 4.00 (Good), while interaction capability achieved 4.18 (Good), indicating that the system structure and interface support effective system interaction. Reliability and performance efficiency recorded 3.90 (Good) and 4.00 (Good) respectively, demonstrating stable system operation. Compatibility and security received 4.10 (Good) and 4.13 (Good), indicating that the system maintains appropriate system integration and data protection. Maintainability obtained 3.96 (Good), suggesting that the system structure allows for manageable updates and improvements. Flexibility recorded the highest evaluation with 4.35 (Excellent), while safety obtained 4.08 (Good), highlighting the system's ability to maintain controlled environmental conditions and generate alerts when necessary. The mobile application interface was rated 4.19 (Good), while the admin web application interface received 4.11 (Good), confirming that the administrative platform effectively supports system monitoring and management. The overall system quality from expert respondents achieved a weighted mean of 4.40, indicating a positive assessment of the system's technical reliability and operational performance.

Overall, the findings indicate that the M.A.S.H. system demonstrates generally positive performance in terms of functionality, usability, and reliability, based on the evaluations of both user and expert respondents. Most system components received Good to Excellent ratings, indicating that the platform is capable of supporting automated mushroom cultivation, real-time monitoring through the mobile application, and product transactions through the e-commerce platform. These results suggest that the system provides a functional and accessible solution for integrating smart mushroom farming with digital product distribution, while also highlighting areas where further refinements in system interfaces and management features may improve overall performance.

## Conclusion and Recommendations
The findings indicate that the M.A.S.H. (Mushroom Automation with Smart Hydro-Environment) system was positively evaluated by both users and expert respondents across various system quality criteria. The results demonstrate that the system effectively supports automated environmental monitoring and control for mushroom cultivation while providing accessible mobile and web-based platforms for system interaction and e-commerce activities. The integration of IoT technology enables real-time monitoring of key environmental parameters, allowing growers to maintain optimal growing conditions. Overall, the system shows strong potential as a practical technological solution for improving efficiency, environmental management, and digital market access in mushroom cultivation.

Future improvements may focus on enhancing system fault tolerance, strengthening security mechanisms, and improving user guidance features to further enhance usability and reliability. In addition, extended field testing across multiple cultivation cycles is recommended to further evaluate system performance and scalability in real-world agricultural environments.

## References
- Center for Tropical Mushroom Research and Development. (2022). *Status of mushroom production in the Philippines.* Central Luzon State University.
- Foffano, M. O. A., Michel, R. C., Freire, D. M. G., & Cavalcanti, E. D. C. (2025). Design and Evaluation of a Compact IoT-Enabled Microfarm for Decentralized Urban Agriculture Applied to the Cultivation of Pleurotus ostreatus (Oyster Mushroom). *Sustainability, 17*(22), 10332. https://doi.org/10.3390/su172210332
- IMARC Group. (2024). *Mushroom market: Global industry trends, share, size, growth, opportunity and forecast 2024-2032.* IMARC Group. https://www.imarcgroup.com/mushroom-market
- Kumar, R. B. S., Yogesh, H. C., Priya, M. M., Muktha, S. P. R., & Ikram, M. (2025). IoT-driven smart farming: Enhancing mushroom cultivation with environmental control and image-based disease detection. *International Journal of Science and Research Archive, 16*(3), 396-401. https://doi.org/10.30574/ijsra.2025.16.3.2565
- Lagare, J. B. (2024, December 20). Meet 'Lazzie': AI seen to enhance online shopping experience. *INQUIRER.net.* https://business.inquirer.net/497613/meet-lazzie-ai-seen-to-enhance-online-shopping-experience
- Shafie Omar, Wan Mohd Faizal Wan Nik, Muhammad Imran Ahmad, Tan Shie Chow, Mohd Nazri Abu Bakar, Shahrul Fazly Man, ... Vikneshwara Ram Suppiah. (2024). IoT Enabled Mushroom Farm Automation with Machine Learning. *Advanced and Sustainable Technologies (ASET), 3*(1), 29-37. https://doi.org/10.58915/aset.v3i1.786
- Rodriguez, J. M. (2025). Market Assessment on White Oyster Mushroom in Luzon, Philippines. *Journal of Management and Sustainable Development, 2*(1), 1-16. Retrieved from https://journal.iistr.org/index.php/JMSD/article/view/794
- Team, R. (n.d.). ReelMind - Open source AI Video Models community. *ReelMind.* https://reelmind.ai/blog/e-commerce-industry-in-the-philippines-ai-powered-growth-strategies
- Villafuerte, A. R., Maano, R. C., De Castro, P. J. L., Chua, A. V., & Ellazar, E. P. (2025). Precision Microclimate Control Using IoT for Enhanced Production of Pleurotus ostreatus (Oyster Mushroom). *Preprints.org.* https://doi.org/10.20944/preprints202508.1094.v1
