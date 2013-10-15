class WelcomeController < ApplicationController
	# require 'soundcloud'
	def index
	end

	def show
		client = SoundCloud.new(client_id: ENV['SOUND_OCEAN_SC_CLIENT_ID'])
		tracks = client.get('/tracks', genres: params[:genre])
		tracks = tracks.select { |track| track['streamable'] }
		tracks = tracks.map do |track|
			{
				id: track["id"], 
				title: track['title'], 
				artist: track['user']['username'],
				genre: track['genre']
			}
		end

		render json: tracks.shuffle[0...5]
	end

end
