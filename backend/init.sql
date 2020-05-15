/* drop tables reverse order so fk constraints don't break */
DROP TABLE IF EXISTS volunteer_Histories;
DROP TABLE IF EXISTS volunteer_Profiles;
DROP TABLE IF EXISTS job_Applicants
DROP TABLE IF EXISTS job_Postings;
DROP TABLE IF EXISTS nonprofit_Organizations;

/* table for nonprofit organizations */
CREATE TABLE nonprofit_Organizations (
    organization_Name varchar(255) NOT NULL UNIQUE,
    organization_ID int NOT NULL UNIQUE,
    job_ID int,
    PRIMARY KEY (organization_ID),
    FOREIGN KEY (job_ID) REFERENCES job_Postings (job_ID)
);

/* table for job postings */
CREATE TABLE job_Postings (
    job_Title varchar(255) NOT NULL UNIQUE,
    job_ID int NOT NULL UNIQUE,
    organization_ID int,
    PRIMARY KEY (job_ID),
    FOREIGN KEY (organization_ID) REFERENCES nonprofit_Organizations (organization_ID)
);

/* table for job applicants */
CREATE TABLE job_Applicants (
    volunteer_ID int,
    organization_ID int,
    job_ID int,
    approved BOOLEAN NOT NULL,
    FOREIGN KEY (volunteer_ID) REFERENCES volunteer_Profiles (volunteer_ID),
    FOREIGN KEY (organization_ID) REFERENCES nonprofit_Organizations (organization_ID),
    FOREIGN KEY (job_ID) REFERENCES job_Postings (job_ID)
);

/*table for volunteer profiles */
CREATE TABLE volunteer_Profiles (
    volunteer_ID int NOT NULL UNIQUE,
    volunteer_Name varchar(255) NOT NULL UNIQUE,
    volunteer_Email varchar(255) NOT NULL UNIQUE,
    volunteer_DOB date NOT NULL,
    location varchar(255) NOT NULL,
    PRIMARY KEY (volunteer_ID)
);

/* table for volunteer histories */
CREATE TABLE volunteer_Histories (
    volunteer_ID int,
    job_ID int,
    organization_ID int,
    FOREIGN KEY (volunteer_ID) REFERENCES volunteer_Profiles (volunteer_ID),
    FOREIGN KEY (job_ID) REFERENCES job_Postings (job_ID),
    FOREIGN KEY (organization_ID) REFERENCES nonprofit_Organizations (organization_ID)
);