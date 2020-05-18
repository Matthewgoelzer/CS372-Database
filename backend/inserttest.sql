INSERT INTO nonprofit_Organizations (organization_Name) VALUES ("nonprofit-organization-1");

INSERT INTO job_Postings (job_Title, organization_ID) VALUES ("Job_Title-1", (SELECT organization_ID FROM nonprofit_Organizations WHERE organization_Name = "nonprofit-organization-1"));

INSERT INTO volunteer_Profiles (volunteer_Name, volunteer_Email, volunteer_DOB, location) VALUES ("volunteer-1", 'vol1@gmail.com', '1994-02-02', "Boise, ID");

INSERT INTO job_Applicants (volunteer_ID, job_ID, approved) VALUES ((SELECT volunteer_ID FROM volunteer_Profiles WHERE volunteer_Name = "volunteer-1"), (SELECT job_ID FROM job_Postings WHERE job_Title = "job_Title-1"), FALSE);

INSERT INTO volunteer_Histories (volunteer_ID, job_ID) VALUES ((SELECT volunteer_ID FROM volunteer_Profiles WHERE volunteer_Name = "volunteer-1"), (SELECT job_ID FROM job_Postings WHERE job_Title = "job_Title-1"));