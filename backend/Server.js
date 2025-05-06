import express from "express";
import mongoose from "mongoose";
import cors from "cors";

//CONFIGURE THE EXPRESS SERVER
const app = express();

//Middleware
app.use(express.json());
app.use(cors());

// app.use(cors({
//   origin:"gjfnkgosf"
// }));


//CONNECT THE DATABASE
try {
  mongoose.connect(
    "mongodb+srv://karkiamit036:T8vC3SIGRcssKWCZ@cluster0.s3wezzy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  );
  console.log("Database connected successfully");
} catch (error) {
  console.log("Database connection failed");
}

app.get("/", (req, res) => {
  res.send("Hello from blog server 123 ");
});

//Blog Schema
const blogsSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  authorName: { type: String, required: true },
  CategoryName: { type: String, required: false },
  timeToRead: { type: Number, required: true },
});

const Blog = mongoose.model("Blog", blogsSchema); //table name

//writer schena
const writerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: Number, required: true, unique: true },
  address: { type: String, required: false, unique: false },
  age: { type: Number, required: false, unique: false },
});

const Writer = mongoose.model("Writer", writerSchema); //table write

//feture Schema
const featureSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: false },
  description: { type: String, required: true },
});

const Feature = mongoose.model("Feature", featureSchema); //table name

//movie schema
const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  purpose: { type: String, required: true },
  length: { type: Number, required: true },
});

const Movie = mongoose.model("Movie", movieSchema);

// Routes

//1 Create the new blog
app.post("/create-blog", async (req, res) => {
  try {
    // console.log(req, "this is request") to show the description of the create thunder
    // console.log(req.body, "this is body")

    // check the title already taken or not
    const blogExist = await Blog.findOne({ title: req.body.title });
    if (blogExist) {
      return res.status(409).json({
        //409 duplicate
        success: false,
        msg: "Blog with this title already exist, please choose the another title",
        data: null,
      });
    }

    const createdBlog = await Blog.create(req.body);
    return res.status(201).json({
      success: true,
      msg: "Blog Created Successfully",
      data: createdBlog,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "something went wrong",
      data: null,
      error: error,
    });
  }
});

//2 Get all blogs
app.get("/get-all-blogs", async (req, res) => {
  try {
    const allBlogs = await Blog.find(); // table name mentioned Blog
    return res.status(200).json({
      success: true,
      msg: "all blog fetched successfully",
      data: allBlogs,
    });
  } catch (error) {
    console.log("Opps something went wrong"); // for the developer
    return res.status(500).json({
      success: false,
      msg: "something went wrong",
      data: null,
      error, // if key and value are same not compulsory to write both
    });
  }
});

//3 get single blog
app.get("/get-single-blog/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "blog not found ",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Single Blog fetched successfylly",
      data: blog,
    });
  } catch (error) {
    return res.status(500).json({
      //in error case 500
      success: false,
      msg: "Opps! something went wrong",
      data: null,
    });
  }
});

// 4. Update a blog put and patch are same their work are to update as same (put bata gardaa sabaii pathaunu parney and patch bata garda j chahinxx tehi matra update gardaa hunx)
app.patch("/update-blog/:id", async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    return res.status(200).json({
      success: true,
      msg: "update success",
      data: updatedBlog,
    });
  } catch (error) {
    return res.status(500).json({
      //in error case 500
      success: false,
      msg: "Opps! something went wrong",
      data: null,
    });
  }
});
// app.put("/update-blog/:id", async (req, res) => {});

//5. DElete a blog
app.delete("/delete-blog/:id", async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) {
      return res.status(404).json({
        success: false,
        msg: "Blog not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Blog deleted successfully",
      data: deletedBlog,
    });
  } catch (error) {
    return res.status(500).json({
      //in error case 500
      success: false,
      msg: "Opps! something went wrong",
      data: null,
    });
  }
});

//write routes
//create
app.post("/create-writer", async (req, res) => {
  try {
    // checj mail
    const emailMatch = await Writer.findOne({ email: req.body.email });
    if (emailMatch) {
      return res.status(409).json({
        success: false,
        msg: "Email was already taken",
        data: null,
      });
    }

    // check phone
    const mobileMatch = await Writer.findOne({ phone: req.body.phone });
    if (mobileMatch) {
      return res.status(409).json({
        success: false,
        msg: "Mobile was already taken",
        data: null,
      });
    }

    const writer = await Writer.create(req.body);
    return res.status(201).json({
      success: true,
      msg: "create success",
      data: writer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "createefailed",
      data: null,
      error,
    });
  }
});

//2 fetch all
app.get("/get-all-writer", async (req, res) => {
  try {
    const getBlog = await Writer.find();
    return res.status(201).json({
      success: true,
      msg: "found all",
      data: getBlog,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "try again",
      data: null,
      error,
    });
  }
});

//3 fetchone
app.get("/get-single-writer/:id", async (req, res) => {
  try {
    const getOne = await Blog.findById(req.params.id);
    if (!getOne) {
      return res.status(404).json({
        success: false,
        msg: "BLog not found ",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      msg: "you success to detect",
      data: getOne,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: "you failed you loser",
      data: null,
      error,
    });
  }
});

//4 updatewriet
app.patch("/update-writer/:id", async (req, res) => {
  try {
    const updated = await Writer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        msg: "writer not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      msg: "update syccess",
      data: updated,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: "you failed to uupdate",
      data: null,
      error,
    });
  }
});

//5 delete writer
app.delete("/delete-writer/:id", async (req, res) => {
  try {
    const deletedWriter = await Writer.findByIdAndDelete(req.params.id);

    if (!deletedWriter) {
      return res.status(404).json({
        success: false,
        msg: "writer with this id doesn't exist",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      msg: "delete success",
      data: deletedWriter,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: "you failed to delete",
      data: null,
      error,
    });
  }
});

// Feature create
app.post("/feature-wala", async (req, res) => {
  try {
    const featureExist = await Feature.findOne({ title: req.body.title });
    if (featureExist) {
      return res.status(402).json({
        success: false,
        msg: "this was alrready taken",
        data: null,
      });
    }

    const featureCreate = await Feature.create(req.body);
    return res.status(200).json({
      success: true,
      msg: "created successful",
      data: featureCreate,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: "try again later",
      data: null,
    });
  }
});

app.get("/get-allfeature", async (req, res) => {
  try {
    const getfeatur = await Feature.find();
    return res.status(200).json({
      success: true,
      msg: "got all",
      data: getfeatur,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: "not found",
      data: null,
    });
  }
});

app.get("/get-onefeature/:id", async (req, res) => {
  try {
    const getOnes = await Feature.findById(req.params.id);

    if (!getOnes) {
      return res.status(400).json({
        success: false,
        msg: "it was already taken",
        data: null,
      });
    }

    // if(!getOne){
    //   return res.status(444).json({
    //     success:false,
    //     msg:"BLog already taken",
    //     data:null
    //   })

    // }

    return res.status(200).json({
      success: true,
      msg: "found it",
      data: getOnes,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: "nout ffound",
      data: null,
      error,
    });
  }
});

app.patch("/updated-version/:id", async (req, res) => {
  try {
    const updatedfe = await Feature.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json({
      success: true,
      msg: "updated successful",
      data: updatedfe,
    });
  } catch (error) {
    return res.status(402).json({
      success: false,
      msg: "update failed",
      data: null,
    });
  }
});

app.delete("/deleted-scene/:id", async (req,res)=>{
  try {

    const deletescene= await Feature.findByIdAndDelete(req.params.id)

    if (!deletescene) {
      return res.status(400).json({
        success: false,
        msg: "not found",
        data:null
      })
    }



    return res.status(200).json({
      success:true,
      msg:"delete successful",
      data: deletescene
    })
    
  } catch (error) {
    return res.status(400).json({
      success:false,
      msg: "not deleted",
      data: null
    })
    
  }
})




app.listen(4000, () => {
  console.log("Blog Server is running at port 4000");
});
