

export interface USER {
    _id: string,
    email: string,
    username: string,
    firstname: string,
    lastname: string,
    register_date: string,
    last_seen:string,
    mobile_number:string,
      display_name:string
      github_token:string
    role:string,
    __v: number
  }
  
  


  export type userType = {
authUser:USER | null
isAuthenticated :boolean
setAuthUser:React.Dispatch<React.SetStateAction<null>>
}

  


export interface CODINGSESSION {
    id: string | number,
    project_name: string,
    user: string,
    language: string,
    duration: string,
    notes: string,
    start_time: string,
    end_time:string,
    tags:string,
  

    // user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    // project_name = models.CharField(max_length=100)
    // language  = models.CharField(max_length=100)
    // duration  =  duration = models.DurationField()
    // notes  = models.CharField(max_length=100)
    // start_time = models.DateTimeField(auto_now=True)
    // end_time = models.DateTimeField(auto_now=True)
    // tags =  TaggableManager()
    
  }

 