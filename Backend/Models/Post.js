const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        maxlength: 500,
    },
    media: {
        type: [String],
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment', 
    }],
    isPublic: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

postSchema.path('content').validate(function (value) {
    return this.content || (this.media && this.media.length > 0);
}, 'Either content or media must be provided.');

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
