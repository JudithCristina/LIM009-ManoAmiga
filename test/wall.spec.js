import MockFirebase from 'mock-cloud-firestore';

const fixtureData = {
  __collection__: {
    users: {
      __doc__: {
        Jqr12I:
        {
          userId: '9URN4KSD9kw9HKNlo47B',
          userName:'user-a',
          email:'jcquinonesi@hotmail.com',
          userPhoto: 'photo.jpg',
          userOccupation: null 
        }
      }
    }
  },
  __collection__: {
    posts: {
      __doc__: {
        GJR4GH4f:
        {
          content: 'este es un post',
          likes: 0,
          state: 'private',
          user: 'user-a',
          userId: '9URN4KSD9kw9HKNlo47B',
          userPhoto: 'photo.jpg',
          image: 'myImagen1.jpg',
          _SubColeccion_: {
            comments: {
              _doc_: {
                iT11G5qi:
                {
                  author: 'user-a',
                  authorId: '9URN4KSD9kw9HKNlo47B',
                  authorPhoto: 'photo.jpg',
                  description: 'este mi primer comentario',
                  idPost: 'GJR4GH4f'
                },
                s6RHIrip:
                {
                  author: 'user-a',
                  authorId: '9URN4KSD9kw9HKNlo47B',
                  authorPhoto: 'photo.jpg',
                  description: 'este mi segundo comentario',
                  idPost: ' GJR4GH4f'
                },
              }
            },
          }/*,
          _SubColeccion_: {
            likes: {
              _doc_: {
                BMClp29:
                {
                  idPost: 'GJR4GH4f',
                  userName: 'abc@gmail.com'
                },
                Vrf91Jup:
                {
                  idPost: 'GJR4GH4f',
                  userName: 'def@gmail.com'
                }
              }
            }
          }
        }*/
      },
      UN3nm7kO:
      {
        content: 'agregando otro post',
        likes: 0,
        state: 'public',
        user: 'user-a',
        userId: '9URN4KSD9kw9HKNlo47B',
        userPhoto: 'photo.jpg',
        image: 'myImagen2.jpg',
        _SubColeccion_: {
          comments: {
            _doc_: {
              iT11G5qi:
              {
                author: 'user-a',
                authorId: '9URN4KSD9kw9HKNlo47B',
                authorPhoto: 'photo.jpg',
                description: 'este mi primer comentario',
                idPost: 'GJR4GH4f'
              },
              s6RHIrip:
              {
                author: 'user-a',
                authorId: '9URN4KSD9kw9HKNlo47B',
                authorPhoto: 'photo.jpg',
                description: 'este mi segundo comentario',
                idPost: ' GJR4GH4f'
              },
            }
          },
        },
       /* _SubColeccion_: {
          likes: {
            _doc_: {
              BMClp29:
              {
                idPost: 'GJR4GH4f',
                userName: 'abc@gmail.com'
              },
              Vrf91Jup:
              {
                idPost: 'GJR4GH4f',
                userName: 'def@gmail.com'
              }

            }
          }

        }*/
      },
      KJ8v55TS:
      {
        content: 'otro post privado',
        likes: 0,
        state: 'private',
        user: 'user-a',
        userId: '9URN4KSD9kw9HKNlo47B',
        userPhoto: 'photo.jpg',
        image: 'myImagen3.jpg',
        _SubColeccion_: {
          comments: {
            _doc_: {
              iT11G5qi:
              {
                author: 'user-a',
                authorId: '9URN4KSD9kw9HKNlo47B',
                authorPhoto: 'photo.jpg',
                description: 'este mi primer comentario',
                idPost: 'GJR4GH4f'
              },
              s6RHIrip:
              {
                author: 'user-a',
                authorId: '9URN4KSD9kw9HKNlo47B',
                authorPhoto: 'photo.jpg',
                description: 'este mi segundo comentario',
                idPost: ' GJR4GH4f'
              },
            }
          },
        }
        /*_SubColeccion_: {
          likes: {
            _doc_: {
              BMClp29:
              {
                idPost: 'GJR4GH4f',
                userName: 'abc@gmail.com'
              },
              Vrf91Jup:
              {
                idPost: 'GJR4GH4f',
                userName: 'def@gmail.com'
              }

            }
          }*/

        },
      }
    }
  }
}


global.firebase = new MockFirebase(fixtureData, { isNaiveSnapshotListenerEnabled: true });

import { createPost, getAllPosts, getPublicPosts, updatePost, deletePost, addCommentPost,getAllComentPost, uploadImage, addLikeToPost, removeLikeToPost, getAllLikesPost, updatePostComments, deletePostComment, createUsers,getUser  } from '../src/controller/wall.js';
import { getCurrenUser } from '../src/controller/login.js';

describe('getPublicPosts', () => {
  it('No debería leer todos los posts privados', (done) => {
    return getPublicPosts((data) => {
      const result = data.find((post) => post.state === 'private');
      expect(result).toBe(undefined);
      done();
    }
    )
  })

  it('debería leer todos los posts públicos', (done) => {
    return getPublicPosts((data) => {
      const result = data.filter((post) => post.state === 'public');
      expect(result.length).toBe(1);
      expect(result[0].content).toBe('agregando otro post');
      done();
    }
    )
  })
});

describe('getAllPosts', () => {
  it('debería leer todos los posts', (done) => {
    return getAllPosts((data) => {
      const result = data.filter((post) => post.state);
      expect(result.length).toBe(3);
      done();
    }
    )
  })

  it('debería leer todos los posts privados', (done) => {
    return getAllPosts((data) => {
      const result = data.filter((post) => post.state === 'private');
      expect(result.length).toBe(2);
      done();
    }
    )
  })

  it('debería leer todos los posts públicos', (done) => {
    return getAllPosts((data) => {
      const result = data.filter((post) => post.state === 'public');
      expect(result.length).toBe(1);
      expect(result[0].content).toBe('agregando otro post');
      done();
    }
    )
  })
});

describe('createPost', () => {
  it('debería ser una función', () => {
    expect(typeof createPost).toBe('function');
  })

  it('deberia agregar un post', (done) => {
    return createPost('9URN4KSD9kw9HKNlo47B', 'user-a', 'photo.jpg', 'This is a post content', 'private')
      .then(() => getAllPosts(
        (data) => {
          const result = data.find((data) => data.content === 'This is a post content');
          expect(result.content).toBe('This is a post content');
          done();
        }
      ));
  })
});

describe('deletePost', () => {
  it('debería poder eliminar un post', (done) => {
    return deletePost('UN3nm7kO')
      .then(() => getAllPosts(
        (data) => {
          const result = data.find((post) => post.id === 'UN3nm7kO');
          expect(result).toBe(undefined);
          done();
        }
      ));
  })
});

describe('createPostCommment', () => {
  it('debería ser una función', () => {
    expect(typeof addCommentPost).toBe('function');
  })

 it('deberia agregar un comentario al post', (done) => {
    return addCommentPost('9URN4KSD9kw9HKNlo47B','GJR4GH4f','este mi primer comentario' ,'user-a', 'photo.jpg')
      .then(() => getAllComentPost('GJR4GH4f',
        (data) => {
          const result = data.find((post) => post.description === 'este mi primer comentario');
          expect(result.description).toBe('este mi primer comentario');
          done();
        }
      ));
  })
});




describe('updatePost', () => {
  it('debería poder modificar un post', (done) => {
    return updatePost('GJR4GH4f', 'Post actualizado', 'public')
      .then(() => getAllPosts(
        (data) => {
          const result = data.find((post) => post.content === 'Post actualizado');
          expect(result.content).toBe('Post actualizado');
          expect(result.state).toBe('public');
          done();
        }
      ));
  })
})

describe('addLikeToPost', () => {
  it('debería ser una función', () => {
    expect(typeof addLikeToPost).toBe('function');
  });
  it('Debería poder dar like con mi usuario logueado', (done) => {
    return addLikeToPost('CD5GGH3SDDHGFG', 'abc@mail.com')
      .then((data) => {
        getAllLikesPost(data._data.postId,
          (likes) => {
            const userLikes = likes.find((user) => user.userName === 'abc@mail.com');
            expect(userLikes.postId).toBe('CD5GGH3SDDHGFG')
            done()
          })
      })
  })
})

describe('removeLikeToPost', () => {
  it('debería ser una función', () => {
    expect(typeof removeLikeToPost).toBe('function');
  });
  it('Debería poder dar like con mi usuario logueado', (done) => {
    return removeLikeToPost('CD5GGH3SDDHGFG', 'abc@mail.com')
      .then((data) => {
        expect(data).toBe(undefined);
        done()
      })
  })
})

describe("getAllComentPost", () => {
  it('debería leer todos los comentarios', (done) => {
    return getAllComentPost("GJR4GH4f", (data) => {
      const result = data.filter((comments) => comments.description==='este mi primer comentario');
      expect(result.length).toBe(1);
      done();
    }
    )
  });
})


describe('updatePostComments', () => {
  it('Debería ser una función', () => {
		expect(typeof updatePostComments).toBe('function');
  })
  it('debería poder modificar un comentario', (done) => {
    return updatePostComments('GJR4GH4f',  "iT11G5qi", 'este mi comentario actualizado')
      .then(() => getAllComentPost( "GJR4GH4f", 
        (data) => {
          const result = data.find((comments) => comments.description === 'este mi comentario actualizado');
          expect(result.description).toBe('este mi comentario actualizado');
          done();
        }
      ));
  })
})


describe('deletePostComment ', () => {
  it('debería poder eliminar un comentario', (done) => {
    return deletePostComment ('GJR4GH4f',  "iT11G5qi")
      .then(() => getAllPosts(
        (data) => {
          const result = data.find((comment) => comment.id === "iT11G5qi");
          expect(result).toBe(undefined);
          done();
        }
      ));
  })
});


      