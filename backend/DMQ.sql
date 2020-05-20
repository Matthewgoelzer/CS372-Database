-- query all jobs for initial landing on search page
SELECT * FROM job_Postings

-- select job searched for
SELECT * FROM job_Postings WHERE job_Title = :job_Title_Searched_For_In_Browser

-- select all job_histories for volunteer
SELECT * FROM volunteer_Histories WHERE volunteer_Name = :volunteer_name_from_profile_page_display_job_history

-- add a new volunteer
INSERT INTO volunteer_Profiles (volunteer_Name, volunteer_Email, volunteer_DOB, location) VALUES (:user_Entered_Name, :user_Entered_Email, :user_Entered_DOB, :user_Entered_Location);

-- add a new organization
INSERT INTO nonprofit_Organizations (organization_Name) VALUES (:user_Entered_Name);

-- add new job applicant
INSERT INTO `job_Applicants` (`volunteer_ID`, `job_ID`, `approved`) VALUES ((SELECT volunteer_ID FROM volunteer_Profiles WHERE volunteer_Name = ?), ?, "0")

-- update an volunteer's application
UPDATE job_Applicants SET approved = :checkbox_From_User_To_Indicate_Approved WHERE volunteer_ID= :volunteer_ID_from_the_update_form

-- delete an application
DELETE FROM job_Applicants WHERE volunteer_id AND job_ID = :volunteer_ID_and_job_ID_selected_from_browse_job_applicants_page

-- delete a job
DELETE FROM job_Postings WHERE job_id = :job_ID_selected_from_browse_organization_profile_page