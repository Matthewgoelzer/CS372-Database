/* table for nonprofit organizations */
CREATE TABLE nonprofit_Organizations (
    organization_Name varchar(255) NOT NULL UNIQUE,
    organization_ID int(11) AUTO_INCREMENT,
    PRIMARY KEY (organization_ID)
) ENGINE=InnoDB;

/* table for job postings */
CREATE TABLE job_Postings (
    job_Title varchar(255) NOT NULL UNIQUE,
    job_ID int(11) AUTO_INCREMENT,
    organization_ID int,
    PRIMARY KEY (job_ID)
) ENGINE=InnoDB;

ALTER TABLE job_Postings
ADD CONSTRAINT fk2 FOREIGN KEY (organization_ID) REFERENCES nonprofit_Organizations(organization_ID);

/*table for volunteer profiles */
CREATE TABLE volunteer_Profiles (
    volunteer_ID int(11) AUTO_INCREMENT,
    volunteer_Name varchar(255) NOT NULL UNIQUE,
    volunteer_Email varchar(255) NOT NULL UNIQUE,
    volunteer_DOB date NOT NULL,
    location varchar(255) NOT NULL,
    PRIMARY KEY (volunteer_ID)
) ENGINE=InnoDB;

/* table for job applicants */
CREATE TABLE job_Applicants (
    volunteer_ID int,
    job_ID int,
    approved BOOLEAN NOT NULL,
    FOREIGN KEY (volunteer_ID) REFERENCES volunteer_Profiles(volunteer_ID),
    FOREIGN KEY (job_ID) REFERENCES job_Postings(job_ID),
    PRIMARY KEY(volunteer_ID, job_ID)
) ENGINE=InnoDB;

/* table for volunteer histories */
CREATE TABLE volunteer_Histories (
    volunteer_ID int,
    job_ID int,
    FOREIGN KEY (volunteer_ID) REFERENCES volunteer_Profiles(volunteer_ID),
    FOREIGN KEY (job_ID) REFERENCES job_Postings(job_ID)
) ENGINE=InnoDB;

/* testing data inserts */
INSERT INTO nonprofit_Organizations (organization_Name) VALUES ("nonprofit-organization-1");

INSERT INTO job_Postings (job_Title, organization_ID) VALUES ("Job_Title-1", (SELECT organization_ID FROM nonprofit_Organizations WHERE organization_Name = "nonprofit-organization-1"));

INSERT INTO volunteer_Profiles (volunteer_Name, volunteer_Email, volunteer_DOB, location) VALUES ("volunteer-1", 'vol1@gmail.com', '1994-02-02', "Boise, ID");

INSERT INTO job_Applicants (volunteer_ID, job_ID, approved) VALUES ((SELECT volunteer_ID FROM volunteer_Profiles WHERE volunteer_Name = "volunteer-1"), (SELECT job_ID FROM job_Postings WHERE job_Title = "job_Title-1"), FALSE);

INSERT INTO volunteer_Histories (volunteer_ID, job_ID) VALUES ((SELECT volunteer_ID FROM volunteer_Profiles WHERE volunteer_Name = "volunteer-1"), (SELECT job_ID FROM job_Postings WHERE job_Title = "job_Title-1"));