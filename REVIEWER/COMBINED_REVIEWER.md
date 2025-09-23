# Combined Reviewer Content

This file glues together the reviewer materials found in this folder without altering the original files.

Files included (originals are left intact in the same folder):

- `Code of Ethics for Fil IT Prof(1).docx`
- `lesson1.1.pptx`
- `lesson1.2.pptx`
- `lesson2.1.pptx`
- `lesson2.2.pptx`

---

IMPORTANT: I have not changed any original files. Binary Office files (.docx/.pptx) cannot be reliably converted to Markdown without a conversion tool. Below are two options â€” a fully automated conversion (recommended) using pandoc, and a pure PowerShell fallback for text extraction.

If you'd like me to produce an actual Markdown concatenation of the *text content* from these files, give the go-ahead and I will attempt to run the conversion here (requires `pandoc` to be installed in the environment). If pandoc is not available I will report back and provide instructions you can run locally.

---

## Quick conversion (recommended) â€” pandoc (Windows / PowerShell)

These commands will convert each file to Markdown and then concatenate them into a single file called `COMBINED_REVIEWER.md` (this file will overwrite itself if you run the final concatenation step):

```powershell
# from repository root (adjust path if needed)
cd "C:\Users\Kenneth\Desktop\PP Namias\Portfolio\REVIEWER"

# Convert each file to Markdown (GitHub-flavored)
pandoc "Code of Ethics for Fil IT Prof(1).docx" -t gfm -o "Code_of_Ethics_for_Fil_IT_Prof(1).md"
pandoc "lesson1.1.pptx" -t gfm -o "lesson1.1.md"
pandoc "lesson1.2.pptx" -t gfm -o "lesson1.2.md"
pandoc "lesson2.1.pptx" -t gfm -o "lesson2.1.md"
pandoc "lesson2.2.pptx" -t gfm -o "lesson2.2.md"

# Concatenate into a single Markdown file (preserves ordering above)
Get-Content "Code_of_Ethics_for_Fil_IT_Prof(1).md", "lesson1.1.md", "lesson1.2.md", "lesson2.1.md", "lesson2.2.md" | Set-Content "COMBINED_REVIEWER.md"
```

Notes:
- pandoc does a good job preserving text content. Slide notes and bullet points from PPTX will be converted to Markdown lists.
- Images and embedded media will not be inlined by the above simple commands. Use `--extract-media` to save images separately if needed.

Example with media extraction:
```powershell
pandoc "lesson1.1.pptx" -t gfm --extract-media="media" -o "lesson1.1.md"
```

---

## Alternative: PowerShell + Word automation (no external install)

If you don't have pandoc, on Windows you can extract raw text from the `.docx` with Word COM and from slides with PowerPoint COM. The following is a fallback (works if Microsoft Word/PowerPoint are installed):

```powershell
# Extract text from DOCX using Word COM
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open((Resolve-Path .\"Code of Ethics for Fil IT Prof(1).docx").Path)
$doc.Content.Text | Out-File -FilePath "Code_of_Ethics_for_Fil_IT_Prof(1)_raw.txt" -Encoding utf8
$doc.Close()
$word.Quit()

# Extract text from PPTX using PowerPoint COM (slides' text)
$pp = New-Object -ComObject Powerpoint.Application
$presentation = $pp.Presentations.Open((Resolve-Path .\"lesson1.1.pptx").Path, [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse)
$allText = ""
foreach ($slide in $presentation.Slides) {
  foreach ($shape in $slide.Shapes) {
    if ($shape.HasTextFrame -and $shape.TextFrame.HasText) {
      $allText += $shape.TextFrame.TextRange.Text + "`n`n"
    }
  }
}
$allText | Out-File -FilePath "lesson1.1_raw.txt" -Encoding utf8
$presentation.Close()
$pp.Quit()
```

Then concatenate the raw text `.txt` files into `COMBINED_REVIEWER.md` and add Markdown headers as you like.

---

## Manual combined placeholder â€” this file

Below I add quick anchors for each file so you have a single place to navigate the originals. If you want me to attempt the pandoc conversion here, reply "Run conversion" and I'll try to execute the recommended pandoc commands and return the merged Markdown file (or explain why it failed if pandoc isn't available).

### Files and anchors

#### Code of Ethics for Fil IT Prof(1).docx
- Original file: `Code of Ethics for Fil IT Prof(1).docx`
 
 ### CODE OF ETHICS FOR THE FILIPINO IT PROFESSIONALS

 **Preamble:**

 I will use my social knowledge and skills for the benefit of the public. I will serve employers and clients with integrity, subject to an overriding responsibility for the public interest, and I will strive to enhance the competence and prestige of the professional. By these, I mean:

 - I will promote public knowledge, understanding and appreciation of information technology;
 - I will consider the general welfare and public good in the performance of my work;
 - I will advertise good or professional in a clear and truthful manner; I will comply and strictly abide by the intellectual property laws, patent laws and other related laws in respect of information technology;
 - I will accept full responsibility for the work undertaken and will utilize my skills with competence and professionalism;
 - I will make truthful statements on my areas of competence as well as the capabilities and qualities of my products and service;
 - I will not disclose or use any confidential information obtained in the course of professional duties without the consent of the parties concerned, except when required by law;
 - I will try to attain the highest in both the products and services I offer;
 - I will not knowingly participate in the development of Information Technology System that will promote the commission of fraud and other unlawful acts;
 - I will uphold and improve the IT professional standard through continuing professional development in order to enhance IT profession.

 Adopted from: University of Cebu 
 College of Information and Computer Science

#### lesson1.1.pptx
- Original file: `lesson1.1.pptx`

#### lesson1.2.pptx
- Original file: `lesson1.2.pptx`

#### lesson2.1.pptx
- Original file: `lesson2.1.pptx`

#### lesson2.2.pptx
- Original file: `lesson2.2.pptx`

---

If you want me to proceed and perform conversion here, reply with one of the options below:

- "Run conversion with pandoc" â€” I will try to run pandoc here and produce `COMBINED_REVIEWER.md` with exact text concatenated.
- "Give me the commands" â€” I will not run anything but confirm the exact commands you can run locally (I already included them above).

If you prefer I should directly attempt a conservative extraction using PowerShell/COM (requires Word/PowerPoint installed), reply "Run PowerShell extraction".

Which option do you want?
#### lesson1.1.pptx
- Original file: $f

---


##### Slide 1

Introduction to Social Issues and Professional Practice

Lesson1


##### Slide 2

Lesson Outcomes:

Define Social IssuesDescribe Professional PracticesExplain Professional EthicsDifferentiate Ethical VS Legal 


##### Slide 3

Social Issues

A social issue or problem is an issue that has been recognized by society as a problem that is preventing society from functioning at an optimal level.


##### Slide 4

Social Issues

It is important to understand that not all things that occur in society are raised to the level of social problems. 


Four factors characterizing social issues:

The public must recognize the situation as a problem.The situation is against the general values accepted by the society.


##### Slide 6

Four factors characterizing social issues:

A large segment of the population recognizes the problem as a valid concern.The problem can be rectified or alleviated through the joint action of citizens and/or community resources.


##### Slide 7

Common social issues in IT


##### Slide 8

Professional practice

Ethical guidelines, rules of conduct, and standard practices that govern the legal, medical, and other professions. Also called standards of professional practice.


##### Slide 9

Professional practice

Also refers to professional responsibility. Professional practice is the way an individual behaves in the workplace.


##### Slide 10

Why do we need to study Social Issues and Professional Practices?


##### Slide 11

To properly address social issues in the workplace abiding guidelines set by the organization based on ethical guidelines, rules of conduct, and standard practices.


##### Slide 12

Case Scenario 1



#### lesson1.2.pptx
- Original file: $f

---


##### Slide 1

Introduction to Social Professional Issues

Lesson1.2


##### Slide 2

Professional ethics

Professionally accepted standards of personal and business behavior, values and guiding principles. Codes of professional ethics are often established by professional organizations to help guide members in performing their job functions according to sound and consistent ethical principles.


##### Slide 3

Professional ethics

 Professional ethics examines the moral and ethical issues that arise in a corporate environment. 


##### Slide 4

Professional ethics

Professional Ethics is a way to provide an answer to those difficult questions through extensive training, sharing real-life examples, and following the practices that makes a profession ethical. 


##### Slide 5

Legal

is the word used to define anything that concerns the law or its workings. It is applicable to all practices, languages, processes, procedures, cultures, and other relative concepts in a system of the law.


##### Slide 6

Ethics

is the word used to define the traditional norms and morals of an individual. 


##### Slide 7

Ethics Quadrant 


##### Slide 8

Copying software, you purchase, making copies for your friends, and charging them for the copies.


##### Slide 9

Making an extra backup of your software just in case both the copy you are using and the primary backup fail for some reason.


##### Slide 10

Giving out the phone numbers of your friends and family, without their permission, to a telecom provider of some sort of calling plan so you can receive a discount.


##### Slide 11

Sending personal e-mail using the company’s account provided to you upon employment.


##### Slide 12

Downloading book , software, web template or music album via Free music and file downloading sites  and using it on your business.


##### Slide 13

RIGHTS OF AN EMPLOYEE 

Employees are an asset to the company, and any ethical organization would like its employees to be happy and prosperous by providing them a safe and happy working environment, steady work, reasonable modifications to work time, and a healthy work-life balance.


##### Slide 14

RIGHTS OF AN EMPLOYEE 

Many companies that top the chart when it comes to providing ideal environments to its employees credit their good employee management and retention programs as the key to their success. 


##### Slide 15

An employee is, at the very least, entitled to the following rights at his workplace:

No discrimination at work, especially on the basis of gender, nationality, religion, medical condition, and political affiliation. 


##### Slide 16

An employee is, at the very least, entitled to the following rights at his workplace:

Healthy work-life balance, which means no long hours at work. Employees can also report if their employer makes unnecessary delays in delegating work. 


##### Slide 17

An employee is, at the very least, entitled to the following rights at his workplace:

Protection of job for people with disabilities and medical conditions. 


##### Slide 18

An employee is, at the very least, entitled to the following rights at his workplace:

Complete protection against sexual harassment of any kind and immunity from being forced to exchange favors for benefits.


##### Slide 20

An employee is, at the very least, entitled to the following rights at his workplace:

Right to ask for safe working conditions and reservation to answering questions on age, religion, nationality, and medical condition. 


##### Slide 21

An employee is, at the very least, entitled to the following rights at his workplace:

Demanding certain changes and modifications regarding the working conditions to accommodate situations that might crop up due to their prevailing medical conditions. 


##### Slide 22

An employee is, at the very least, entitled to the following rights at his workplace:

Right to form or participate a union that aims to improve the wages, lifestyle, working environment, and emphasizes on employee rights at the workplaces. 


##### Slide 23

Case Scenario 2


##### Slide 24

Case Scenario 3



#### lesson2.1.pptx
- Original file: $f

---


##### Slide 1

Professional Ethics

Lesson 2


##### Slide 2

Learning Outcomes:

Define EthicsDiscuss Commandments of Computer EthicsActivity


##### Slide 3

Define ETHICS

“Ethics” is currently a general term for concerns about what people should do. The term “ethics” comes from the Greek word “ethike” that means “character,” and indeed the ancient Greeks conceived issues about what people should do in terms of impact upon character (Aristotle, 350 BCE).


##### Slide 4

Define ETHICS

It is when the concern is good reputation “ethics” seems to be an inclusive term for concerns also referred to by “morality,” “value,” and “justice.” the value or goodness of things and situations and with the justness of institutions 


##### Slide 5

Define ETHICS-www.merriam-webster.com

the discipline dealing with what is good and bad and with moral duty and obligationa set of moral principles : a theory or system of moral values


##### Slide 6

Define ETHICS-www.merriam-webster.com

the principles of conduct governing an individual or a groupa guiding philosophya consciousness of moral importancea set of moral issues or aspects (such as rightness)


##### Slide 7

Ethics VS Morals: Is there a difference?

Ethics and morals are both used in the plural and are often regarded as synonyms, but there is some distinction in how they are used.


##### Slide 8

Ethics VS Morals: Is there a difference?

Morals often describes one's values concerning what is right and what is wrong.


##### Slide 9

Ethics VS Morals: Is there a difference?

It would go against my morals to help you cheat on the test.He appears to view himself as a kind of culture warrior, striking out against the crumbling morals of modern society. - Jonathan Goldsbie, Now Toronto, 16 Oct. 2014


##### Slide 10

Ethics VS Morals: Is there a difference?

While ethics can refer broadly to moral principles, one often sees it applied to questions of correct behavior within a relatively narrow area of activity:


##### Slide 11

Ethics VS Morals: Is there a difference?

Our class had a debate over the ethics of genetic testing.Anybody, it seemed, could make the music -- if they couldn't play guitar, they could push a button -- and nobody worried about the ethics of appropriating riffs. -Jennifer Foote, Newsweek, 23 July 1990


##### Slide 12

Ethics VS Morals: Is there a difference?

In addition, morals usually connotes an element of subjective preference, while ethics tends to suggest aspects of universal fairness and the question of whether an action is responsible.


##### Slide 13

The 10 Commandments of Computer Ethicslisted by: Computer Ethics Institute

Rule #1: Thou shalt not use a computer to harm other people. Rule #2: Thou shalt not interfere with other people's computer work.


##### Slide 14

The 10 Commandments of Computer Ethics

Rule #3: Thou shalt not snoop around in other people's computer files.Rule #4) Thou shalt not use a computer to steal. 


##### Slide 15

The 10 Commandments of Computer Ethics

Rule #5: Thou shalt not use a computer to bear false witness. Rule #6: Thou shalt not copy or use proprietary software for which you have not paid.


##### Slide 16

The 10 Commandments of Computer Ethics

Rule #7: Thou shalt not use other people's computer resources. without authorization or proper compensation.


##### Slide 17

The 10 Commandments of Computer Ethics

Rule #8: Thou shalt not appropriate other people's intellectual output.


##### Slide 18

The 10 Commandments of Computer Ethics

Rule #9) Thou shalt think about the social consequences of the program you are writing or the system you are designing.


##### Slide 19

The 10 Commandments of Computer Ethics

Rule #10) Thou shalt always use a computer in ways that ensure consideration and respect for your fellow humans.


##### Slide 20

The 10 Commandments of Computer Ethics

Watch this!?


##### Slide 21

Preamble: I will use my social knowledge and skills for the benefit of the public. I will serve employers and clients with integrity, subject to an overriding responsibility for the public interest, and I will strive to enhance the competence and prestige of the professional. By these, I mean: • I will promote public knowledge, understanding and appreciation of information technology; • I will consider the general welfare and public good in the performance of my work; • I will advertise good or professional in a clear and truthful manner; I will comply and strictly abide by the intellectual property laws, patent laws and other related laws in respect of information technology; • I will accept full responsibility for the work undertaken and will utilize my skills with competence and professionalism; • I will make truthful statements on my areas of competence as well as the capabilities and qualities of my products and service; • I will not disclose or use any confidential information obtained in the course of professional duties without the consent of the parties concerned, except when required by law; • I will try to attain the highest in both the products and services I offer; • I will not knowingly participate in the development of information technology system that will promote the commission of fraud and other unlawful acts; • I will uphold and improve the IT professional standard through continuing professional development in order to enhance IT profession.

CODE OF ETHICS FOR THE FILIPINO IT PROFESSIONALS



#### lesson2.2.pptx
- Original file: $f

---


##### Slide 1

Professional ethics

CS210 – 1Lesson 2.3


##### Slide 2

Learning Outcomes:


##### Slide 3

Netiquette


##### Slide 4

Netiquette


##### Slide 5

Virginia Shea 

Dubbed the "network manners guru" by the San Jose Mercury News, Virginia Shea has been a student of human nature all her life. She attended Princeton University and has worked in Silicon Valley since the mid-1980s. * Image from Albion.com


##### Slide 6

Virginia Shea’s Rules of Netiquette


##### Slide 7

Are we following this rules as we enter the cyberspace?


##### Slide 9

1. Make sure identification is clear in all communications. Begin with a salutation (“hi, Jason!”) And end with your signature (“hannah kay, criminology 101”).

Netiquette in Online Education


##### Slide 10

2. Review what you wrote and try to interpret it objectively. When we speak face to face and are misunderstood, we have an on-the-spot opportunity to rephrase our words. In writing, we must strive twice as hard to be understood, as we do not have the benefit of modifying or elaborating in real time. All caps (“I’M SHOUTING”) and exclamation points (“give me a break!!!”) Can be misinterpreted as intense anger or humor without the appropriate context.

Netiquette in Online Education


##### Slide 11

3. If you wouldn’t say it face to face, don’t say it online. When you’re working online, you’re safe behind a screen, but that’s no excuse to be ill-mannered or say things you would never say in public.

Netiquette in Online Education


##### Slide 12

4. Don’t assume everyone understands where you’re coming from. Sarcasm and wit is often the spice of in-person conversation, but in online discussion, it can not only lose its edge, but it can also bite! In your high school classroom, all students were the same age, came from similar backgrounds and lived in the same area. In contrast, your online classroom is made up of people of all ages and cultures who have varied backgrounds, lifestyles and geographic locations. Review what you wrote before contributing to the conversation and ask yourself, “Will everyone get the joke?”

Netiquette in Online Education


##### Slide 13

5. Don’t spam. Please don’t take advantage of your connection with the other students in your online classroom to forward emails and links regarding your political/spiritual beliefs or to sell your services.

Netiquette in Online Education


##### Slide 14

6. Use emoticons. In casual chatroom settings, emoticons can help convey feelings that may otherwise get lost in translation, including humor, exasperation, exhaustion and even confusion. ? ? ?

Netiquette in Online Education


##### Slide 15

7. Respect others’ privacy. Don’t give out another student’s personal email address without permission.

Netiquette in Online Education


##### Slide 17

9. Follow the rules. Just as your online college posts guidelines related to academic integrity and student expectations, online forums also have rules of conduct. Make a point to read them every time, as they can vary from class to class.

Netiquette in Online Education


##### Slide 18

10. Forgive and forget. If you’re offended by something another student says online, keep in mind that you may have misunderstood their intentions. Give them the benefit of the doubt.

Netiquette in Online Education


##### Slide 19

Importance of Netiquette for Virtual Employees


##### Slide 20

Importance of Netiquette for Virtual Employees

1. Stay on target. Be direct when having a conversation with a colleague or client. This should include clearly defining your goals and objectives.2. Speak without conflict. Avoid language that could be perceived as confrontational or sarcastic in nature. While playful banter is a great way to get to know someone, it is not something that should be exhibited in a virtual office. A misunderstanding can be easily misconstrued and can lead to conflicts.


##### Slide 21

Importance of Netiquette for Virtual Employees

3. Communicate in a timely manner. When responding to a client or colleague be conscious of time between responses. When a lapse occurs, expectations may not be met, and this may leave the client or colleague feeling ignored. It can also make a working relationship strained and more difficult.4. Keep to the point. Stay on topic with colleagues and clients in conversations and meetings. Straying from the task at hand can lead to a dysfunctional and under-performing working relationship.


##### Slide 22

Importance of Netiquette for Virtual Employees

5. Text matters. Using inappropriate grammar and capitalization can set an unintended tone when communicating through text. Overuse of capitalization throughout a text can come across as abrasive. It is important to proof text prior to exchanging.6. Acknowledge contributions. Be generous with positive feedback to clients and coworkers. This will create trust in the virtual setting and help to develop a more productive environment.


##### Slide 23

Importance of Netiquette for Virtual Employees

7. Check for understanding. Make time to stop and confirm that all ideas and concepts you are communicating are being grasped. When one does not comprehend, ask which ideas or concepts were missed and try to approach them differently.8. Be a good listener. Not only is it important to listen for information being exchanged between yourself and a client or colleague, but it is also important to listen for voice inflection or hesitations. Being able to listen and identify these clues is key in developing a clearer bridge of communication.


##### Slide 24

Importance of Netiquette for Virtual Employees

9. Pay attention. Be sure to give your undivided attention to all parties during conversations and meetings. This ensures a better use of time and makes it less likely that you will miss key details presented.10. Consensus before conclusion. At the end of a conversation, all parties should agree on what progress was made and set a timeline for any additional tasks. It is important to review objectives to ensure that they are all completed.



#### lesson1.1.pptx
- Original file: $f

---


##### Slide 1

Introduction to Social Issues and Professional Practice

Lesson1


##### Slide 2

Lesson Outcomes:

Define Social IssuesDescribe Professional PracticesExplain Professional EthicsDifferentiate Ethical VS Legal 


##### Slide 3

Social Issues

A social issue or problem is an issue that has been recognized by society as a problem that is preventing society from functioning at an optimal level.


Social Issues

It is important to understand that not all things that occur in society are raised to the level of social problems. 


##### Slide 5

Four factors characterizing social issues:

The public must recognize the situation as a problem.The situation is against the general values accepted by the society.


##### Slide 6

Four factors characterizing social issues:

A large segment of the population recognizes the problem as a valid concern.The problem can be rectified or alleviated through the joint action of citizens and/or community resources.


##### Slide 7

Common social issues in IT


##### Slide 8

Professional practice

Ethical guidelines, rules of conduct, and standard practices that govern the legal, medical, and other professions. Also called standards of professional practice.


##### Slide 9

Professional practice

Also refers to professional responsibility. Professional practice is the way an individual behaves in the workplace.


##### Slide 10

Why do we need to study Social Issues and Professional Practices?


##### Slide 11

To properly address social issues in the workplace abiding guidelines set by the organization based on ethical guidelines, rules of conduct, and standard practices.


##### Slide 12

Case Scenario 1



#### lesson1.2.pptx
- Original file: $f

---


##### Slide 1

Introduction to Social Professional Issues

Lesson1.2


##### Slide 2

Professional ethics

Professionally accepted standards of personal and business behavior, values and guiding principles. Codes of professional ethics are often established by professional organizations to help guide members in performing their job functions according to sound and consistent ethical principles.


##### Slide 3

Professional ethics

 Professional ethics examines the moral and ethical issues that arise in a corporate environment. 


##### Slide 4

Professional ethics

Professional Ethics is a way to provide an answer to those difficult questions through extensive training, sharing real-life examples, and following the practices that makes a profession ethical. 


##### Slide 5

Legal

is the word used to define anything that concerns the law or its workings. It is applicable to all practices, languages, processes, procedures, cultures, and other relative concepts in a system of the law.


##### Slide 6

Ethics

is the word used to define the traditional norms and morals of an individual. 


##### Slide 7

Ethics Quadrant 


##### Slide 8

Copying software, you purchase, making copies for your friends, and charging them for the copies.


##### Slide 9

Making an extra backup of your software just in case both the copy you are using and the primary backup fail for some reason.


##### Slide 10

Giving out the phone numbers of your friends and family, without their permission, to a telecom provider of some sort of calling plan so you can receive a discount.


##### Slide 11

Sending personal e-mail using the company’s account provided to you upon employment.


##### Slide 12

Downloading book , software, web template or music album via Free music and file downloading sites  and using it on your business.


##### Slide 13

RIGHTS OF AN EMPLOYEE 

Employees are an asset to the company, and any ethical organization would like its employees to be happy and prosperous by providing them a safe and happy working environment, steady work, reasonable modifications to work time, and a healthy work-life balance.


##### Slide 14

RIGHTS OF AN EMPLOYEE 

Many companies that top the chart when it comes to providing ideal environments to its employees credit their good employee management and retention programs as the key to their success. 


##### Slide 15

An employee is, at the very least, entitled to the following rights at his workplace:

No discrimination at work, especially on the basis of gender, nationality, religion, medical condition, and political affiliation. 


##### Slide 16

An employee is, at the very least, entitled to the following rights at his workplace:

Healthy work-life balance, which means no long hours at work. Employees can also report if their employer makes unnecessary delays in delegating work. 


##### Slide 17

An employee is, at the very least, entitled to the following rights at his workplace:

Protection of job for people with disabilities and medical conditions. 


##### Slide 19

An employee is, at the very least, entitled to the following rights at his workplace:

Freedom to discuss the terms and conditions of the employment with other employees and negotiating wages to suit lifestyle as per changing times.


##### Slide 20

An employee is, at the very least, entitled to the following rights at his workplace:

Right to ask for safe working conditions and reservation to answering questions on age, religion, nationality, and medical condition. 


##### Slide 21

An employee is, at the very least, entitled to the following rights at his workplace:

Demanding certain changes and modifications regarding the working conditions to accommodate situations that might crop up due to their prevailing medical conditions. 


##### Slide 22

An employee is, at the very least, entitled to the following rights at his workplace:

Right to form or participate a union that aims to improve the wages, lifestyle, working environment, and emphasizes on employee rights at the workplaces. 


##### Slide 23

Case Scenario 2


##### Slide 24

Case Scenario 3



#### lesson2.1.pptx
- Original file: $f

---


##### Slide 1

Professional Ethics

Lesson 2


##### Slide 2

Learning Outcomes:

Define EthicsDiscuss Commandments of Computer EthicsActivity


##### Slide 3

Define ETHICS

“Ethics” is currently a general term for concerns about what people should do. The term “ethics” comes from the Greek word “ethike” that means “character,” and indeed the ancient Greeks conceived issues about what people should do in terms of impact upon character (Aristotle, 350 BCE).


##### Slide 4

Define ETHICS

It is when the concern is good reputation “ethics” seems to be an inclusive term for concerns also referred to by “morality,” “value,” and “justice.” the value or goodness of things and situations and with the justness of institutions 


##### Slide 5

Define ETHICS-www.merriam-webster.com

the discipline dealing with what is good and bad and with moral duty and obligationa set of moral principles : a theory or system of moral values


##### Slide 6

Define ETHICS-www.merriam-webster.com

the principles of conduct governing an individual or a groupa guiding philosophya consciousness of moral importancea set of moral issues or aspects (such as rightness)


##### Slide 7

Ethics VS Morals: Is there a difference?

Ethics and morals are both used in the plural and are often regarded as synonyms, but there is some distinction in how they are used.


##### Slide 8

Ethics VS Morals: Is there a difference?

Morals often describes one's values concerning what is right and what is wrong.


##### Slide 9

Ethics VS Morals: Is there a difference?

It would go against my morals to help you cheat on the test.He appears to view himself as a kind of culture warrior, striking out against the crumbling morals of modern society. - Jonathan Goldsbie, Now Toronto, 16 Oct. 2014


##### Slide 10

Ethics VS Morals: Is there a difference?

While ethics can refer broadly to moral principles, one often sees it applied to questions of correct behavior within a relatively narrow area of activity:


##### Slide 11

Ethics VS Morals: Is there a difference?

Our class had a debate over the ethics of genetic testing.Anybody, it seemed, could make the music -- if they couldn't play guitar, they could push a button -- and nobody worried about the ethics of appropriating riffs. -Jennifer Foote, Newsweek, 23 July 1990


##### Slide 12

Ethics VS Morals: Is there a difference?

In addition, morals usually connotes an element of subjective preference, while ethics tends to suggest aspects of universal fairness and the question of whether an action is responsible.


##### Slide 13

The 10 Commandments of Computer Ethicslisted by: Computer Ethics Institute

Rule #1: Thou shalt not use a computer to harm other people. Rule #2: Thou shalt not interfere with other people's computer work.


##### Slide 14

The 10 Commandments of Computer Ethics

Rule #3: Thou shalt not snoop around in other people's computer files.Rule #4) Thou shalt not use a computer to steal. 


##### Slide 15

The 10 Commandments of Computer Ethics

Rule #5: Thou shalt not use a computer to bear false witness. Rule #6: Thou shalt not copy or use proprietary software for which you have not paid.


##### Slide 16

The 10 Commandments of Computer Ethics

Rule #7: Thou shalt not use other people's computer resources. without authorization or proper compensation.


##### Slide 17

The 10 Commandments of Computer Ethics

Rule #8: Thou shalt not appropriate other people's intellectual output.


##### Slide 18

The 10 Commandments of Computer Ethics

Rule #9) Thou shalt think about the social consequences of the program you are writing or the system you are designing.


##### Slide 19

The 10 Commandments of Computer Ethics

Rule #10) Thou shalt always use a computer in ways that ensure consideration and respect for your fellow humans.


##### Slide 20

The 10 Commandments of Computer Ethics

Watch this!?


##### Slide 21

Preamble: I will use my social knowledge and skills for the benefit of the public. I will serve employers and clients with integrity, subject to an overriding responsibility for the public interest, and I will strive to enhance the competence and prestige of the professional. By these, I mean: • I will promote public knowledge, understanding and appreciation of information technology; • I will consider the general welfare and public good in the performance of my work; • I will advertise good or professional in a clear and truthful manner; I will comply and strictly abide by the intellectual property laws, patent laws and other related laws in respect of information technology; • I will accept full responsibility for the work undertaken and will utilize my skills with competence and professionalism; • I will make truthful statements on my areas of competence as well as the capabilities and qualities of my products and service; • I will not disclose or use any confidential information obtained in the course of professional duties without the consent of the parties concerned, except when required by law; • I will try to attain the highest in both the products and services I offer; • I will not knowingly participate in the development of information technology system that will promote the commission of fraud and other unlawful acts; • I will uphold and improve the IT professional standard through continuing professional development in order to enhance IT profession.

CODE OF ETHICS FOR THE FILIPINO IT PROFESSIONALS



#### lesson2.2.pptx
- Original file: $f

---


##### Slide 1

Professional ethics

CS210 – 1Lesson 2.3


##### Slide 2

Learning Outcomes:


##### Slide 3

Netiquette


##### Slide 5

Virginia Shea 

Dubbed the "network manners guru" by the San Jose Mercury News, Virginia Shea has been a student of human nature all her life. She attended Princeton University and has worked in Silicon Valley since the mid-1980s. * Image from Albion.com


Virginia Shea’s Rules of Netiquette


##### Slide 8

Are we following this rules as we enter the cyberspace?


##### Slide 9

1. Make sure identification is clear in all communications. Begin with a salutation (“hi, Jason!”) And end with your signature (“hannah kay, criminology 101”).

Netiquette in Online Education


##### Slide 10

2. Review what you wrote and try to interpret it objectively. When we speak face to face and are misunderstood, we have an on-the-spot opportunity to rephrase our words. In writing, we must strive twice as hard to be understood, as we do not have the benefit of modifying or elaborating in real time. All caps (“I’M SHOUTING”) and exclamation points (“give me a break!!!”) Can be misinterpreted as intense anger or humor without the appropriate context.

Netiquette in Online Education


##### Slide 11

3. If you wouldn’t say it face to face, don’t say it online. When you’re working online, you’re safe behind a screen, but that’s no excuse to be ill-mannered or say things you would never say in public.

Netiquette in Online Education


##### Slide 12

4. Don’t assume everyone understands where you’re coming from. Sarcasm and wit is often the spice of in-person conversation, but in online discussion, it can not only lose its edge, but it can also bite! In your high school classroom, all students were the same age, came from similar backgrounds and lived in the same area. In contrast, your online classroom is made up of people of all ages and cultures who have varied backgrounds, lifestyles and geographic locations. Review what you wrote before contributing to the conversation and ask yourself, “Will everyone get the joke?”

Netiquette in Online Education


##### Slide 13

5. Don’t spam. Please don’t take advantage of your connection with the other students in your online classroom to forward emails and links regarding your political/spiritual beliefs or to sell your services.

Netiquette in Online Education


##### Slide 14

6. Use emoticons. In casual chatroom settings, emoticons can help convey feelings that may otherwise get lost in translation, including humor, exasperation, exhaustion and even confusion. ? ? ?

Netiquette in Online Education


##### Slide 15

7. Respect others’ privacy. Don’t give out another student’s personal email address without permission.

Netiquette in Online Education


##### Slide 17

9. Follow the rules. Just as your online college posts guidelines related to academic integrity and student expectations, online forums also have rules of conduct. Make a point to read them every time, as they can vary from class to class.

Netiquette in Online Education


##### Slide 18

10. Forgive and forget. If you’re offended by something another student says online, keep in mind that you may have misunderstood their intentions. Give them the benefit of the doubt.

Netiquette in Online Education


##### Slide 19

Importance of Netiquette for Virtual Employees


##### Slide 20

Importance of Netiquette for Virtual Employees

1. Stay on target. Be direct when having a conversation with a colleague or client. This should include clearly defining your goals and objectives.2. Speak without conflict. Avoid language that could be perceived as confrontational or sarcastic in nature. While playful banter is a great way to get to know someone, it is not something that should be exhibited in a virtual office. A misunderstanding can be easily misconstrued and can lead to conflicts.


##### Slide 21

Importance of Netiquette for Virtual Employees

3. Communicate in a timely manner. When responding to a client or colleague be conscious of time between responses. When a lapse occurs, expectations may not be met, and this may leave the client or colleague feeling ignored. It can also make a working relationship strained and more difficult.4. Keep to the point. Stay on topic with colleagues and clients in conversations and meetings. Straying from the task at hand can lead to a dysfunctional and under-performing working relationship.


##### Slide 22

Importance of Netiquette for Virtual Employees

5. Text matters. Using inappropriate grammar and capitalization can set an unintended tone when communicating through text. Overuse of capitalization throughout a text can come across as abrasive. It is important to proof text prior to exchanging.6. Acknowledge contributions. Be generous with positive feedback to clients and coworkers. This will create trust in the virtual setting and help to develop a more productive environment.


##### Slide 23

Importance of Netiquette for Virtual Employees

7. Check for understanding. Make time to stop and confirm that all ideas and concepts you are communicating are being grasped. When one does not comprehend, ask which ideas or concepts were missed and try to approach them differently.8. Be a good listener. Not only is it important to listen for information being exchanged between yourself and a client or colleague, but it is also important to listen for voice inflection or hesitations. Being able to listen and identify these clues is key in developing a clearer bridge of communication.


##### Slide 24

Importance of Netiquette for Virtual Employees

9. Pay attention. Be sure to give your undivided attention to all parties during conversations and meetings. This ensures a better use of time and makes it less likely that you will miss key details presented.10. Consensus before conclusion. At the end of a conversation, all parties should agree on what progress was made and set a timeline for any additional tasks. It is important to review objectives to ensure that they are all completed.


