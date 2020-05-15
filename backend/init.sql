/* table for nonprofit organizations */
CREATE TABLE nonprofit_Organizations (
    organization_Name varchar(255) NOT NULL UNIQUE,
    organization_ID int NOT NULL UNIQUE,
    job_ID int,
    PRIMARY KEY (organization_ID)
) ENGINE=InnoDB;

/* table for job postings */
CREATE TABLE job_Postings (
    job_Title varchar(255) NOT NULL UNIQUE,
    job_ID int NOT NULL UNIQUE,
    organization_ID int,
    PRIMARY KEY (job_ID)
) ENGINE=InnoDB;

ALTER TABLE nonprofit_Organizations
ADD CONSTRAINT fk1 FOREIGN KEY (job_ID) REFERENCES job_Postings(job_ID);

ALTER TABLE job_Postings
ADD CONSTRAINT fk2 FOREIGN KEY (organization_ID) REFERENCES nonprofit_Organizations(organization_ID);

/*table for volunteer profiles */
CREATE TABLE volunteer_Profiles (
    volunteer_ID int NOT NULL UNIQUE,
    volunteer_Name varchar(255) NOT NULL UNIQUE,
    volunteer_Email varchar(255) NOT NULL UNIQUE,
    volunteer_DOB date NOT NULL,
    location varchar(255) NOT NULL,
    PRIMARY KEY (volunteer_ID)
) ENGINE=InnoDB;

/* table for job applicants */
CREATE TABLE job_Applicants (
    volunteer_ID int,
    organization_ID int,
    job_ID int,
    approved BOOLEAN NOT NULL,
    FOREIGN KEY (volunteer_ID) REFERENCES volunteer_Profiles(volunteer_ID),
    FOREIGN KEY (organization_ID) REFERENCES nonprofit_Organizations(organization_ID),
    FOREIGN KEY (job_ID) REFERENCES job_Postings(job_ID)
) ENGINE=InnoDB;

/* table for volunteer histories */
CREATE TABLE volunteer_Histories (
    volunteer_ID int,
    job_ID int,
    organization_ID int,
    FOREIGN KEY (volunteer_ID) REFERENCES volunteer_Profiles(volunteer_ID),
    FOREIGN KEY (job_ID) REFERENCES job_Postings(job_ID),
    FOREIGN KEY (organization_ID) REFERENCES nonprofit_Organizations(organization_ID)
) ENGINE=InnoDB;